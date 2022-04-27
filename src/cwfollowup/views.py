import json
import jwt
import datetime
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
                downloadToken
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
    return result['viterbiResultFiles']['files']


def get_id_from_token(info, job_id, token):
    query = """
        mutation ResultFileMutation($input: GenerateFileDownloadIdsInput!) {
            generateFileDownloadIds(input: $input) {
                result
            }
        }
    """

    variables = {
        "input": {
            "jobId": job_id,
            "downloadTokens": [token]
        }
    }

    result = perform_viterbi_query(
        query=query,
        variables=variables,
        headers=info.context.headers,
        method=info.context.method
    )

    return result['generateFileDownloadIds']['result'][0]


def get_candidate_file_data(info, job_id):
    file_list = get_viterbi_result_files(info, job_id)
    candidate_file = next(filter(lambda f: 'results_a0_phase_loglikes_scores.dat' in f['path'], file_list))
    candidate_file_id = get_id_from_token(info, job_id, candidate_file['downloadToken'])
    file_url = settings.GWCLOUD_JOB_CONTROLLER_API_URL + '/file/?fileId=' + candidate_file_id
    return requests.get(file_url).text


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
        return None


def get_viterbi_candidates(info, job_id):
    source_dataset = get_source_dataset(info, job_id)
    candidate_file_data = get_candidate_file_data(info, job_id)
    candidates = []
    for candidate_data in candidate_file_data.strip().split('\n'):
        candidate = candidate_data.split()
        candidates.append({
            'orbit_period': float(candidate[0]),
            'asini': float(candidate[1]),
            'orbit_tp': float(candidate[2]),
            'target_binary': all(candidate[0:3]),
            'candidate_frequency': float(candidate[5]),
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

        # Submit the job to the job controller

        # Create the jwt token
        jwt_enc = jwt.encode(
            {
                'userId': user.user_id,
                'exp': datetime.datetime.now() + datetime.timedelta(days=30)
            },
            settings.JOB_CONTROLLER_JWT_SECRET,
            algorithm='HS256'
        )

        # Create the parameter json
        params = followup_job.as_json()
        print(params)

        # Construct the request parameters to the job controller, note that parameters must be a string, not an objects
        data = {
            "parameters": json.dumps(params),
            "cluster": "ozstar_gwlab",
            "bundle": "bbb09782b80376c58c1909f447ef07b5dab91630"
        }

        # Initiate the request to the job controller
        result = requests.request(
            "POST", settings.GWCLOUD_JOB_CONTROLLER_API_URL + "/job/",
            data=json.dumps(data),
            headers={
                "Authorization": jwt_enc
            }
        )

        # Check that the request was successful
        if result.status_code != 200:
            # Oops
            msg = f"Error submitting job, got error code: {result.status_code}\n\n{result.headers}\n\n{result.content}"
            print(msg)
            raise Exception(msg)

        print(f"Job submitted OK.\n{result.headers}\n\n{result.content}")

        # Parse the response from the job controller
        result = json.loads(result.content)

        # Save the job id
        followup_job.job_controller_id = result["jobId"]
        followup_job.save()

        return followup_job


def update_cwfollowup_job(job_id, user, private):
    cwfollowup_job = CWFollowupJob.get_by_id(job_id, user)

    if user.user_id == cwfollowup_job.user_id:
        cwfollowup_job.private = private
        cwfollowup_job.save()

        return 'Job saved!'
    else:
        raise Exception('You must own the job to change the privacy!')
