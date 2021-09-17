from types import SimpleNamespace

cwfollowup_parameters = SimpleNamespace()

cwfollowup_parameters.FAKE_DATA = ["simulated", "Simulated"]
cwfollowup_parameters.REAL_DATA = ["real", "Real"]

cwfollowup_parameters.DATA_SOURCES = [
    cwfollowup_parameters.FAKE_DATA,
    cwfollowup_parameters.REAL_DATA
]

cwfollowup_parameters.O1 = ["o1", "O1"]
cwfollowup_parameters.O2 = ["o2", "O2"]
cwfollowup_parameters.O3 = ["o3", "O3"]
cwfollowup_parameters.O4 = ["o4", "O4"]

cwfollowup_parameters.SOURCE_DATASETS = [
    cwfollowup_parameters.O1,
    cwfollowup_parameters.O2,
    cwfollowup_parameters.O3,
    cwfollowup_parameters.O4
]
