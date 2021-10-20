import graphene
import cwfollowup.schema
import cwfollowup.viterbi_schema


class Query(cwfollowup.schema.Query, cwfollowup.viterbi_schema.Query, graphene.ObjectType):
    pass


class Mutation(cwfollowup.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
