import graphene
import cwfollowup.schema


class Query(cwfollowup.schema.Query, graphene.ObjectType):
    pass


class Mutation(cwfollowup.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
