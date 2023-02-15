from decimal import Decimal
import graphene
from graphene import relay
from graphene_django.types import DjangoObjectType
from django_filters import FilterSet, OrderingFilter
from graphene_django.filter import DjangoFilterConnectionField
from graphql import GraphQLError
from graphql_jwt.decorators import login_required
from graphql_relay.node.node import from_global_id, to_global_id

from .types import OutputStartType, JobStatusType
from .views import create_followup_job, get_candidate_group
from .status import JobStatus
from .models import CWFollowupJob, FileDownloadToken

from .utils.jobs.request_job_filter import request_job_filter
from .utils.db_search.db_search import perform_db_search
from .utils.derive_job_status import derive_job_status
from .utils.jobs.request_file_download_id import request_file_download_ids


class UserCWFollowupJobFilter(FilterSet):
    class Meta:
        model = CWFollowupJob
        fields = [
            'user_id',
            'name',
            'description',
            'private',
            'last_updated',
        ]

    order_by = OrderingFilter(
        fields=(
            ('last_updated', 'lastUpdated'),
            ('name', 'name'),
        )
    )

    @property
    def qs(self):
        return CWFollowupJob.user_cwfollowup_job_filter(super(UserCWFollowupJobFilter, self).qs, self)


class PublicCWFollowupJobFilter(FilterSet):
    class Meta:
        model = CWFollowupJob
        fields = [
            'user_id',
            'name',
            'description',
            'private',
            'last_updated',
        ]

    order_by = OrderingFilter(
        fields=(
            ('last_updated', 'last_updated'),
            ('name', 'name'),
        )
    )

    @property
    def qs(self):
        return CWFollowupJob.public_cwfollowup_job_filter(super(PublicCWFollowupJobFilter, self).qs, self)


class CandidateGroupType(graphene.ObjectType):
    id = graphene.ID()
    name = graphene.String()
    description = graphene.String()
    nCandidates = graphene.Int()


class CWFollowupJobNode(DjangoObjectType):
    class Meta:
        model = CWFollowupJob
        convert_choices_to_enum = False
        interfaces = (relay.Node,)

    last_updated = graphene.String()
    start = graphene.Field(OutputStartType)
    job_status = graphene.Field(JobStatusType)
    followups = graphene.List(graphene.String)
    candidate_group = graphene.Field(CandidateGroupType)

    def resolve_followups(parent, info):
        return parent.followups.values_list('followup', flat=True)

    @classmethod
    def get_queryset(parent, queryset, info):
        return CWFollowupJob.cwfollowup_job_filter(queryset, info)

    def resolve_last_updated(parent, info):
        return parent.last_updated.strftime("%Y-%m-%d %H:%M:%S UTC")

    def resolve_start(parent, info):
        return {
            "name": parent.name,
            "description": parent.description,
            "private": parent.private
        }

    def resolve_job_status(parent, info):
        try:
            # Get job details from the job controller
            _, jc_jobs = request_job_filter(
                info.context.user.user_id,
                ids=[parent.job_controller_id]
            )

            status_number, status_name, status_date = derive_job_status(jc_jobs[0]["history"])

            return {
                "name": status_name,
                "number": status_number,
                "date": status_date.strftime("%Y-%m-%d %H:%M:%S UTC")
            }
        except Exception:
            return {
                "name": "Unknown",
                "number": 0,
                "data": "Unknown"
            }

    def resolve_candidate_group(parent, info):
        group_id = to_global_id('CandidateGroupNode', parent.candidate_group_id)
        group_data = get_candidate_group(group_id, info.context.headers)

        return CandidateGroupType(**group_data)


class CWFollowupResultFile(graphene.ObjectType):
    path = graphene.String()
    is_dir = graphene.Boolean()
    file_size = graphene.Decimal()
    download_token = graphene.String()


class CWFollowupResultFiles(graphene.ObjectType):
    class Meta:
        interfaces = (relay.Node,)

    class Input:
        job_id = graphene.ID()

    files = graphene.List(CWFollowupResultFile)


class CWFollowupPublicJobNode(graphene.ObjectType):
    user = graphene.String()
    name = graphene.String()
    job_status = graphene.Field(JobStatusType)
    description = graphene.String()
    timestamp = graphene.String()
    id = graphene.ID()


class CWFollowupPublicJobConnection(relay.Connection):
    class Meta:
        node = CWFollowupPublicJobNode


class Query(graphene.ObjectType):
    cwfollowup_job = relay.Node.Field(CWFollowupJobNode)
    cwfollowup_jobs = DjangoFilterConnectionField(CWFollowupJobNode, filterset_class=UserCWFollowupJobFilter)
    public_cwfollowup_jobs = relay.ConnectionField(
        CWFollowupPublicJobConnection,
        search=graphene.String(),
        time_range=graphene.String()
    )

    cwfollowup_result_files = graphene.Field(CWFollowupResultFiles, job_id=graphene.ID(required=True))

    candidate_group = graphene.Field(CandidateGroupType, group_id=graphene.ID(required=True))

    @login_required
    def resolve_public_cwfollowup_jobs(self, info, **kwargs):
        # Perform the database search
        success, jobs = perform_db_search(info.context.user, kwargs)
        if not success:
            return []

        # Parse the result in to graphql objects
        result = []
        for job in jobs:
            result.append(
                CWFollowupPublicJobNode(
                    user=f"{job['user']['firstName']} {job['user']['lastName']}",
                    name=job['job']['name'],
                    description=job['job']['description'],
                    job_status=JobStatusType(
                        name=JobStatus.display_name(job['history'][0]['state']),
                        number=job['history'][0]['state'],
                        date=job['history'][0]['timestamp']
                    ),
                    timestamp=job['history'][0]['timestamp'],
                    id=to_global_id("CWFollowupJobNode", job['job']['id'])
                )
            )

        # Nb. The perform_db_search function currently requests one extra record than kwargs['first'].
        # This triggers the ArrayConnection used by returning the result array to correctly set
        # hasNextPage correctly, such that infinite scroll works as expected.
        return result

    @login_required
    def resolve_cwfollowup_result_files(self, info, **kwargs):
        # Get the model id of the cwfollowup job
        _, job_id = from_global_id(kwargs.get("job_id"))

        # Try to look up the job with the id provided
        job = CWFollowupJob.get_by_id(job_id, info.context.user)

        # Fetch the file list from the job controller
        success, files = job.get_file_list()
        if not success:
            raise Exception("Error getting file list. " + str(files))

        # Generate download tokens for the list of files
        paths = [f['path'] for f in filter(lambda x: not x['isDir'], files)]
        tokens = FileDownloadToken.create(job, paths)

        # Generate a dict that can be used to query the generated tokens
        token_dict = {tk.path: tk.token for tk in tokens}

        # Build the resulting file list and send it back to the client
        result = [
            CWFollowupResultFile(
                path=f["path"],
                is_dir=f["isDir"],
                file_size=Decimal(f["fileSize"]),
                download_token=token_dict[f["path"]] if f["path"] in token_dict else None
            )
            for f in files
        ]

        return CWFollowupResultFiles(
            files=result
        )

    @login_required
    def resolve_candidate_group(parent, info, group_id):
        group_data = get_candidate_group(group_id, info.context.headers)

        return CandidateGroupType(**group_data)


class CWFollowupJobCreationResult(graphene.ObjectType):
    job_id = graphene.String()


class CWFollowupJobMutation(relay.ClientIDMutation):
    class Input:
        name = graphene.String()
        description = graphene.String()
        candidate_group_id = graphene.ID()
        followups = graphene.List(graphene.String)

    result = graphene.Field(CWFollowupJobCreationResult)

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, name, description, candidate_group_id, followups):
        group_id = from_global_id(candidate_group_id)[1]
        followup_job = create_followup_job(info.context.user, name, description, group_id, followups)
        # Convert the viterbi job id to a global id
        job_id = to_global_id("CWFollowupJobNode", followup_job.id)

        return CWFollowupJobMutation(
            result=CWFollowupJobCreationResult(job_id=job_id)
        )


class GenerateFileDownloadIds(relay.ClientIDMutation):
    class Input:
        job_id = graphene.ID(required=True)
        download_tokens = graphene.List(graphene.String, required=True)

    result = graphene.List(graphene.String)

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, job_id, download_tokens):
        user = info.context.user

        # Get the job these file downloads are for
        job = CWFollowupJob.get_by_id(from_global_id(job_id)[1], user)

        # Verify the download tokens and get the paths
        paths = FileDownloadToken.get_paths(job, download_tokens)

        # Check that all tokens were found
        if None in paths:
            raise GraphQLError("At least one token was invalid or expired.")

        # Request the list of file download ids from the list of paths
        # Only the original job author may generate a file download id
        success, result = request_file_download_ids(
            job,
            paths
        )

        # Report the error if there is one
        if not success:
            raise GraphQLError(result)

        # Return the list of file download ids
        return GenerateFileDownloadIds(
            result=result
        )


class Mutation(graphene.ObjectType):
    new_cwfollowup_job = CWFollowupJobMutation.Field()
    generate_file_download_ids = GenerateFileDownloadIds.Field()
