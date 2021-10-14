import graphene
from graphene import relay
from graphene.utils.str_converters import to_snake_case

from .types import ViterbiStartType, ViterbiDataType, ViterbiLabelType, ViterbiJobStatusType
from .views import create_followup_job, perform_viterbi_query, get_viterbi_candidates
from .utils.generate_viterbi_query import generate_viterbi_query


def recursively_map_dict_keys(func, obj):
    if isinstance(obj, dict):  # if dict, apply to each key
        return {func(k): recursively_map_dict_keys(func, v) for k, v in obj.items()}
    elif isinstance(obj, list):  # if list, apply to each element
        return [recursively_map_dict_keys(func, elem) for elem in obj]
    else:
        return obj


def viterbi_resolver(parent, info, *args, **kwargs):
    return parent.get(to_snake_case(info.path[-1]), None)  # path[-1] is the name of the field that we are resolving


def viterbi_connection_resolver(parent, info, *args, **kwargs):
    connection = parent.get(to_snake_case(info.path[-1]), None)
    return [datum['node'] for datum in connection['edges']] if connection else []


class ViterbiJobNode(graphene.ObjectType):
    class Meta:
        convert_choices_to_enum = False
        interfaces = (relay.Node,)

    id = graphene.ID(required=True)
    name = graphene.String()
    description = graphene.String()
    last_updated = graphene.String()
    start = graphene.Field(ViterbiStartType)
    data = graphene.Field(ViterbiDataType)
    job_status = graphene.Field(ViterbiJobStatusType)
    labels = graphene.List(ViterbiLabelType)


class ViterbiJobConnection(relay.Connection):
    class Meta:
        node = ViterbiJobNode


class ViterbiPublicJobNode(graphene.ObjectType):
    user = graphene.String()
    name = graphene.String()
    job_status = graphene.Field(ViterbiJobStatusType)
    labels = graphene.List(ViterbiLabelType)
    description = graphene.String()
    timestamp = graphene.String()
    id = graphene.ID()


class ViterbiPublicJobConnection(relay.Connection):
    class Meta:
        node = ViterbiPublicJobNode


class ViterbiJobCandidate(graphene.ObjectType):
    orbit_period = graphene.String()
    asini = graphene.String()
    orbit_tp = graphene.String()
    candidate_frequency = graphene.String()
    source_dataset = graphene.String()


class Viterbi(graphene.ObjectType):
    viterbi_job = graphene.Field(
        ViterbiJobNode,
        id=graphene.ID(required=True),
        resolver=viterbi_resolver
    )

    viterbi_jobs = relay.ConnectionField(
        ViterbiJobConnection,
        order_by=graphene.String(),
        resolver=viterbi_connection_resolver
    )

    public_viterbi_jobs = relay.ConnectionField(
        ViterbiPublicJobConnection,
        search=graphene.String(),
        time_range=graphene.String(),
        resolver=viterbi_connection_resolver
    )


class Query(graphene.ObjectType):
    viterbi = graphene.Field(Viterbi)

    def resolve_viterbi(parent, info):
        query = generate_viterbi_query(info)
        data = recursively_map_dict_keys(
            to_snake_case,
            perform_viterbi_query(
                query,
                info.variable_values,
                info.context.headers,
                info.context.method
            )
        )
        return data

    viterbi_job_candidates = graphene.List(
        ViterbiJobCandidate,
        job_id=graphene.ID(required=True)
    )

    def resolve_viterbi_job_candidates(parent, info, job_id):
        return get_viterbi_candidates(info, job_id)


class CWFollowupJobMutation(relay.ClientIDMutation):
    class Input:
        name = graphene.String()
        description = graphene.String()
        is_uploaded = graphene.Boolean()
        viterbi_id = graphene.ID(required=False)
        candidates = graphene.List(ViterbiJobCandidate)
        followups = graphene.List(graphene.String)

    result = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **kwargs):
        followup_job = create_followup_job(info.context.user, **kwargs)
        return CWFollowupJobMutation(
            result=followup_job.id
        )


class Mutation(graphene.ObjectType):
    new_cwfollowup_job = CWFollowupJobMutation.Field()
    # update_cwfollowup = UpdateCWFollowupMutation.Field()
