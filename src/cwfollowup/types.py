from graphene import InputObjectType, ObjectType, Int, Float, String, Boolean, ID


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


class ViterbiJobInputType(InputObjectType):
    viterbi_id = ID()


class UploadedDataInputType(InputObjectType):
    source_dataset = String()
    candidate_frequency = Float()
    orbit_period = Float()
    orbit_tp = Float()
    asini = Float()
