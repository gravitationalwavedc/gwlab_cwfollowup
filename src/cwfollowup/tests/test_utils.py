import functools
import logging


def silence_errors(func):
    @functools.wraps(func)
    def wrapper_silence_errors(*args, **kwargs):
        try:
            logging.disable(logging.ERROR)
            func(*args, **kwargs)
        finally:
            logging.disable(logging.NOTSET)
    return wrapper_silence_errors


VITERBI_FILE_LIST = [
    {
        "path": "/archive.tar.gz",
        "downloadId": "3413abcd-4222-4812-9774-eb76826ae0b4"
    },
    {
        "path": "/atoms/188-0/atoms-0",
        "downloadId": "4e877e22-fd06-4509-bf32-be9af1f41496"
    },
    {
        "path": "/atoms/188-0/atoms-1",
        "downloadId": "de4b7697-a251-4797-a741-04b21568843b"
    },
    {
        "path": "/atoms/188-0/atoms-10",
        "downloadId": "19b7044a-3722-40c4-a479-20697e8dd00f"
    },
    {
        "path": "/atoms/188-0/atoms-11",
        "downloadId": "89a6d77c-8bea-4087-892b-01938989fa17"
    },
    {
        "path": "/atoms/188-0/atoms-12",
        "downloadId": "45445207-a164-4fcf-ab1b-2395051f351f"
    },
    {
        "path": "/atoms/188-0/atoms-13",
        "downloadId": "f2fb8483-cb64-49a7-b9a3-cc6ee560139c"
    },
    {
        "path": "/atoms/188-0/atoms-14",
        "downloadId": "2fd0c891-3d94-48d8-8070-b61df7db32c7"
    },
    {
        "path": "/atoms/188-0/atoms-15",
        "downloadId": "3113ff50-309d-4196-8c8c-d05bad68e482"
    },
    {
        "path": "/atoms/188-0/atoms-16",
        "downloadId": "82ff82ef-e047-4b86-8676-8277cf56e27c"
    },
    {
        "path": "/atoms/188-0/atoms-17",
        "downloadId": "b8edb9d6-bdf7-4c71-8fc3-408a5fc3d9b3"
    },
    {
        "path": "/atoms/188-0/atoms-18",
        "downloadId": "a7b6da79-118f-43f2-ab88-42a6926ce1ea"
    },
    {
        "path": "/atoms/188-0/atoms-2",
        "downloadId": "bec229cf-70de-4c4a-81f6-b11a93ea76ea"
    },
    {
        "path": "/atoms/188-0/atoms-3",
        "downloadId": "e49bb4e0-9009-4485-9990-de6be4a3c0ab"
    },
    {
        "path": "/atoms/188-0/atoms-4",
        "downloadId": "ff5b90d5-00e4-4d38-be52-c99332313f4a"
    },
    {
        "path": "/atoms/188-0/atoms-5",
        "downloadId": "50905dfa-c1f2-4026-b32c-be75fb91916d"
    },
    {
        "path": "/atoms/188-0/atoms-6",
        "downloadId": "07df5204-9763-4ad4-bc5c-b7040451b697"
    },
    {
        "path": "/atoms/188-0/atoms-7",
        "downloadId": "3f4f1809-047f-4a0c-983b-01fbb90d9412"
    },
    {
        "path": "/atoms/188-0/atoms-8",
        "downloadId": "06bce577-a8a1-4347-b85a-9a8b1ccac363"
    },
    {
        "path": "/atoms/188-0/atoms-9",
        "downloadId": "f2659330-d7f5-49b2-9678-513ca3ed188b"
    },
    {
        "path": "/atoms/188-0/sfts_used.txt",
        "downloadId": "fff7adf2-f11f-4c62-9217-08c890e26cf3"
    },
    {
        "path": "/atoms/LewisTest1_atoms.err",
        "downloadId": "35729874-4127-424a-8dcb-c5a2668f4305"
    },
    {
        "path": "/atoms/LewisTest1_atoms.out",
        "downloadId": "7cd51fbe-57c2-42f1-818e-e2f90df0dd65"
    },
    {
        "path": "/LewisTest1_atoms.ini",
        "downloadId": "acdf635e-1f73-4431-bbb0-10b85d1731c4"
    },
    {
        "path": "/LewisTest1_viterbi.ini",
        "downloadId": "a5ff0695-3a0d-4906-beaa-1e5f3c04620f"
    },
    {
        "path": "/submit/LewisTest1_atoms.sh",
        "downloadId": "8db49148-c4e4-4b75-9a96-78c19105c3e5"
    },
    {
        "path": "/submit/LewisTest1_master_slurm.err",
        "downloadId": "28b8d936-7214-4a49-a0bc-5a7b4f14429d"
    },
    {
        "path": "/submit/LewisTest1_master_slurm.out",
        "downloadId": "d506c4d1-40b9-4f7e-bb03-4076adf72503"
    },
    {
        "path": "/submit/LewisTest1_master_slurm.sh",
        "downloadId": "aee40fc5-3902-4f85-92a8-f1ec4d9b9749"
    },
    {
        "path": "/submit/LewisTest1_viterbi.sh",
        "downloadId": "b019335c-b3e5-4d3d-8fbb-87277cc631e8"
    },
    {
        "path": "/submit/slurm_ids",
        "downloadId": "45042d89-5b02-4a84-84bc-dec3bd72548c"
    },
    {
        "path": "/viterbi/LewisTest1_viterbi.err",
        "downloadId": "139c1998-669c-4118-92af-d0643c8bd22b"
    },
    {
        "path": "/viterbi/LewisTest1_viterbi.out",
        "downloadId": "a1f5587b-5d28-40bb-b64c-371ec84c69df"
    },
    {
        "path": "/viterbi/results_a0_phase_loglikes_scores.dat",
        "downloadId": "71e25981-a095-4858-b6ae-079501adc149"
    },
    {
        "path": "/viterbi/results_path.dat",
        "downloadId": "c3451b9b-c7d8-4250-8f4f-8502fe141240"
    },
    {
        "path": "/viterbi/results_scores.dat",
        "downloadId": "f8ee3fa2-2d9a-47ca-b191-bb07eb022609"
    }
]

VITERBI_CANDIDATE_DATA = """4995.2629999999999200 0.0184400000000000 1238160133.5651631355285645 162.0154821241656862 5.4954833260897198 188.3977384308864771
4995.2629999999999200 0.0184400000000000 1238160166.1664347648620605 169.9148906622573634 6.2403122161570179 188.8011734252867200
4995.2629999999999200 0.0184400000000000 1238160198.7677066326141357 170.3002375769642072 6.2605250413559030 188.4588963880759138"""
