import json
import requests
from django.conf import settings
from django.db import transaction

from .models import CWFollowupJob, CWFollowup, CWJob, CWJobCandidate


def perform_viterbi_query(query, variables, headers, method):
    result = requests.request(
        method=method,
        url=settings.GWLAB_VITERBI_GRAPHQL_URL,
        headers=headers,
        json={
            "query": query,
            "variables": variables
        }
    )
    return json.loads(result.content)['data']


def get_viterbi_result_files(info, job_id):
    query = """query ($jobId: ID!) {
        viterbiResultFiles (jobId: $jobId) {
            files {
                path
                downloadId
            }
        }
    }
    """
    variables = {"jobId": job_id}
    result = perform_viterbi_query(
        query=query,
        variables=variables,
        headers=info.context.headers,
        method=info.context.method
    )
    return json.loads(result.content)['data']


def get_min_start_time(info, job_id):
    query = """query ($jobId: ID!) {
        viterbiJob (id: $jobId) {
            data {
                minStartTime
            }
        }
    }
    """
    variables = {"jobId": job_id}
    result = perform_viterbi_query(
        query=query,
        variables=variables,
        headers=info.context.headers,
        method=info.context.method
    )
    return int(result['viterbiJob']['data']['minStartTime'])


def get_source_dataset(info, job_id):
    min_start_time = get_min_start_time(info, job_id)
    if 1126051217 <= min_start_time <= 1137254417:
        return 'o1'
    elif 1164556817 <= min_start_time <= 1187733618:
        return 'o2'
    elif 1238166018 <= min_start_time <= 1269388818:  # O3a start time to end of O3b (approximately)
        return 'o3'
    else:
        return 'o3'


def get_viterbi_candidates(info, job_id):
    source_dataset = get_source_dataset(info, job_id)
    file_list = get_viterbi_result_files(info, job_id)['viterbiResultFiles']['files']
    candidate_file = next(filter(lambda f: 'results_a0_phase_loglikes_scores.dat' in f['path'], file_list))
    candidate_file_data = requests.get('https://gwcloud.org.au/job/apiv1/file/?fileId=' + candidate_file['downloadId'])
    candidates = []
    for candidate_data in candidate_file_data.text.strip().split('\n'):
        candidate = candidate_data.split()
        candidates.append({
            'orbit_period': candidate[0],
            'asini': candidate[1],
            'orbit_tp': candidate[2],
            'candidate_frequency': candidate[5],
            'source_dataset': source_dataset
        })

    return candidates


def create_followup_job(user, name, description, is_uploaded, followups, candidates, viterbi_id=None):
    with transaction.atomic():
        cw_job = CWJob(
            user_id=user.user_id,
            is_uploaded=is_uploaded,
            viterbi_id=viterbi_id
        )
        cw_job.save()

        for candidate in candidates:
            candidate_model = CWJobCandidate(job=cw_job, **candidate)
            candidate_model.save()

        followup_job = CWFollowupJob(
            user_id=user.user_id,
            name=name,
            description=description,
            cw_job=cw_job
        )
        followup_job.save()
        for followup in followups:
            cwfollowup = CWFollowup(
                followup_job=followup_job,
                followup=followup,
            )
            cwfollowup.save()

        return followup_job
