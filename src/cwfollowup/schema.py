import graphene
from graphene import relay
from graphene.utils.str_converters import to_snake_case
# from graphql_jwt.decorators import login_required

from .types import ViterbiStartType, ViterbiDataType, ViterbiLabelType, ViterbiJobStatusType, \
                    ViterbiJobInputType, UploadedDataInputType
from .views import create_followup_job, perform_viterbi_query


def recursively_map_dict_keys(func, obj):
    if isinstance(obj, dict):  # if dict, apply to each key
        return {func(k): recursively_map_dict_keys(func, v) for k, v in obj.items()}
    elif isinstance(obj, list):  # if list, apply to each element
        return [recursively_map_dict_keys(func, elem) for elem in obj]
    else:
        return obj


# @login_required
def viterbi_resolvers(name):
    def func(parent, info, **kwargs):
        request_data = perform_viterbi_query(info.context)
        # Handle connections
        if issubclass(info.return_type.graphene_type, relay.Connection):
            return [
                recursively_map_dict_keys(
                    to_snake_case,
                    request_datum['node']
                ) for request_datum in request_data[info.path[-1]]['edges']
            ]
        # Handle nodes
        elif relay.is_node(info.return_type.graphene_type):
            return recursively_map_dict_keys(
                to_snake_case,
                request_data[info.path[-1]]
            )

    return func


# Used to give values to fields in a DjangoObjectType, if the fields were not present in the Django model
# Specifically used here to get values from the parameter models
def populate_fields(object_to_modify, field_list, resolver_func):
    for name in field_list:
        setattr(object_to_modify, 'resolve_{}'.format(name), staticmethod(resolver_func(name)))


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


class TestText(graphene.ObjectType):
    text = graphene.String()


class Query(object):
    viterbi_job = graphene.Field(ViterbiJobNode, id=graphene.ID(required=True))
    viterbi_jobs = relay.ConnectionField(
        ViterbiJobConnection,
        order_by=graphene.String()
    )
    public_viterbi_jobs = relay.ConnectionField(
        ViterbiPublicJobConnection,
        search=graphene.String(),
        time_range=graphene.String()
    )


populate_fields(
    Query,
    [
        'viterbi_job',
        'viterbi_jobs',
        'public_viterbi_jobs'
    ],
    viterbi_resolvers
)


class CWFollowupJobMutation(relay.ClientIDMutation):
    class Input:
        name = graphene.String()
        description = graphene.String()
        is_uploaded = graphene.Boolean()
        uploaded_job = UploadedDataInputType(required=False)
        viterbi_job = ViterbiJobInputType(required=False)
        followups = graphene.List(graphene.String)

    result = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **kwargs):
        print(kwargs)
        followup_job = create_followup_job(info.context.user, **kwargs)
        return CWFollowupJobMutation(
            result=followup_job.id
        )


class Mutation(graphene.ObjectType):
    new_cwfollowup_job = CWFollowupJobMutation.Field()
    # update_cwfollowup = UpdateCWFollowupMutation.Field()
