import json
import jwt
import datetime
import requests
from django.conf import settings
from django.db import transaction

from .models import CWFollowupJob, CWFollowup


def create_followup_job(user, name, description, candidate_group_id, followups):
    with transaction.atomic():
        followup_job = CWFollowupJob(
            user_id=user.user_id,
            name=name,
            description=description,
            candidate_group_id=candidate_group_id
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
