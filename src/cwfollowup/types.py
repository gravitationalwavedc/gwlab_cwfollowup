from graphene import InputObjectType, ObjectType, Int, Float, String, Boolean
from graphene_django.types import DjangoObjectType
from .models import CWJobCandidate


class ViterbiStartType(ObjectType):
    name = String()
    description = String()
    private = Boolean()


class ViterbiDataType(ObjectType):
    data_choice = String()
    source_dataset = String()
    start_frequency_band = String()
    min_start_time = String()
    max_start_time = String()
    asini = String()
    freq_band = String()
    alpha = String()
    delta = String()
    orbit_tp = String()
    orbit_period = String()
    drift_time = String()
    d_freq = String()


class ViterbiLabelType(ObjectType):
    name = String()
    description = String()


class ViterbiJobStatusType(ObjectType):
    name = String()
    number = Int()
    date = String()


class OutputStartType(ObjectType):
    name = String()
    description = String()
    private = Boolean()


class JobStatusType(ObjectType):
    name = String()
    number = Int()
    date = String()


class CandidateInputType(InputObjectType):
    source_dataset = String()
    candidate_frequency = Float()
    orbit_period = Float()
    orbit_tp = Float()
    asini = Float()


class CandidateType(DjangoObjectType):
    class Meta:
        model = CWJobCandidate
