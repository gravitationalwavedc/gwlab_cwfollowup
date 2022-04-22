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
        "downloadToken": "/archive.tar.gz-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-0",
        "downloadToken": "/atoms/188-0/atoms-0-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-1",
        "downloadToken": "/atoms/188-0/atoms-1-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-10",
        "downloadToken": "/atoms/188-0/atoms-10-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-11",
        "downloadToken": "/atoms/188-0/atoms-11-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-12",
        "downloadToken": "/atoms/188-0/atoms-12-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-13",
        "downloadToken": "/atoms/188-0/atoms-13-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-14",
        "downloadToken": "/atoms/188-0/atoms-14-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-15",
        "downloadToken": "/atoms/188-0/atoms-15-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-16",
        "downloadToken": "/atoms/188-0/atoms-16-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-17",
        "downloadToken": "/atoms/188-0/atoms-17-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-18",
        "downloadToken": "/atoms/188-0/atoms-18-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-2",
        "downloadToken": "/atoms/188-0/atoms-2-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-3",
        "downloadToken": "/atoms/188-0/atoms-3-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-4",
        "downloadToken": "/atoms/188-0/atoms-4-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-5",
        "downloadToken": "/atoms/188-0/atoms-5-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-6",
        "downloadToken": "/atoms/188-0/atoms-6-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-7",
        "downloadToken": "/atoms/188-0/atoms-7-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-8",
        "downloadToken": "/atoms/188-0/atoms-8-test-token"
    },
    {
        "path": "/atoms/188-0/atoms-9",
        "downloadToken": "/atoms/188-0/atoms-9-test-token"
    },
    {
        "path": "/atoms/188-0/sfts_used.txt",
        "downloadToken": "/atoms/188-0/sfts_used.txt-test-token"
    },
    {
        "path": "/atoms/LewisTest1_atoms.err",
        "downloadToken": "/atoms/LewisTest1_atoms.err-test-token"
    },
    {
        "path": "/atoms/LewisTest1_atoms.out",
        "downloadToken": "/atoms/LewisTest1_atoms.out-test-token"
    },
    {
        "path": "/LewisTest1_atoms.ini",
        "downloadToken": "/LewisTest1_atoms.ini-test-token"
    },
    {
        "path": "/LewisTest1_viterbi.ini",
        "downloadToken": "/LewisTest1_viterbi.ini-test-token"
    },
    {
        "path": "/submit/LewisTest1_atoms.sh",
        "downloadToken": "/submit/LewisTest1_atoms.sh-test-token"
    },
    {
        "path": "/submit/LewisTest1_master_slurm.err",
        "downloadToken": "/submit/LewisTest1_master_slurm.err-test-token"
    },
    {
        "path": "/submit/LewisTest1_master_slurm.out",
        "downloadToken": "/submit/LewisTest1_master_slurm.out-test-token"
    },
    {
        "path": "/submit/LewisTest1_master_slurm.sh",
        "downloadToken": "/submit/LewisTest1_master_slurm.sh-test-token"
    },
    {
        "path": "/submit/LewisTest1_viterbi.sh",
        "downloadToken": "/submit/LewisTest1_viterbi.sh-test-token"
    },
    {
        "path": "/submit/slurm_ids",
        "downloadToken": "/submit/slurm_ids-test-token"
    },
    {
        "path": "/viterbi/LewisTest1_viterbi.err",
        "downloadToken": "/viterbi/LewisTest1_viterbi.err-test-token"
    },
    {
        "path": "/viterbi/LewisTest1_viterbi.out",
        "downloadToken": "/viterbi/LewisTest1_viterbi.out-test-token"
    },
    {
        "path": "/viterbi/results_a0_phase_loglikes_scores.dat",
        "downloadToken": "/viterbi/results_a0_phase_loglikes_scores.dat-test-token"
    },
    {
        "path": "/viterbi/results_path.dat",
        "downloadToken": "/viterbi/results_path.dat-test-token"
    },
    {
        "path": "/viterbi/results_scores.dat",
        "downloadToken": "/viterbi/results_scores.dat-test-token"
    }
]

VITERBI_CANDIDATE_DATA = """4995.2629999999999200 0.0184400000000000 1238160133.5651631355285645 162.0154821241656862 5.4954833260897198 188.3977384308864771
4995.2629999999999200 0.0184400000000000 1238160166.1664347648620605 169.9148906622573634 6.2403122161570179 188.8011734252867200
4995.2629999999999200 0.0184400000000000 1238160198.7677066326141357 170.3002375769642072 6.2605250413559030 188.4588963880759138"""
