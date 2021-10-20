import graphene
from graphene import relay
from graphene_django.types import DjangoObjectType
from django_filters import FilterSet, OrderingFilter
from graphene_django.filter import DjangoFilterConnectionField
from graphql_jwt.decorators import login_required
from graphql_relay.node.node import to_global_id

from .types import CandidateInputType, OutputStartType, JobStatusType, CandidateType
from .utils.jobs.request_job_filter import request_job_filter
from .utils.db_search.db_search import perform_db_search
from .utils.derive_job_status import derive_job_status
from .views import create_followup_job
from .status import JobStatus
from .models import CWFollowupJob


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


class CWFollowupJobNode(DjangoObjectType):
    class Meta:
        model = CWFollowupJob
        convert_choices_to_enum = False
        interfaces = (relay.Node,)

    last_updated = graphene.String()
    start = graphene.Field(OutputStartType)
    job_status = graphene.Field(JobStatusType)
    candidates = graphene.List(CandidateType)
    followups = graphene.List(graphene.String)

    def resolve_candidates(parent, info):
        return parent.cw_job.candidate.all()

    def resolve_followups(parent, info):
        return parent.followup.values_list('followup', flat=True)

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


class CWFollowupJobCreationResult(graphene.ObjectType):
    job_id = graphene.String()


class CWFollowupJobMutation(relay.ClientIDMutation):
    class Input:
        name = graphene.String()
        description = graphene.String()
        is_uploaded = graphene.Boolean()
        viterbi_id = graphene.ID(required=False)
        candidates = graphene.List(CandidateInputType)
        followups = graphene.List(graphene.String)

    result = graphene.Field(CWFollowupJobCreationResult)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **kwargs):
        followup_job = create_followup_job(info.context.user, **kwargs)
        # Convert the viterbi job id to a global id
        job_id = to_global_id("CWFollowupJobNode", followup_job.id)

        return CWFollowupJobMutation(
            result=CWFollowupJobCreationResult(job_id=job_id)
        )


class Mutation(graphene.ObjectType):
    new_cwfollowup_job = CWFollowupJobMutation.Field()
