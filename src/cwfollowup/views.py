import datetime
import json

import jwt
import requests
from django.conf import settings
from django.db import transaction

# from .forms import CwFollowupJobForm
from .models import CwFollowupJob, DataParameter, Label, SearchParameter, Data, Search


def create_cwfollowup_job(user, start, data, data_parameters, search_parameters):
    # validate_form = CwFollowupJobForm(data={**start, **data, **signal, **sampler})
    # should be making use of cleaned_data below

    # Right now, it is not possible to create a non-ligo job
    if not user.is_ligo:
        raise Exception("User must be ligo")

    with transaction.atomic():
        cwfollowup_job = CwFollowupJob(
            user_id=user.user_id,
            name=start.name,
            description=start.description,
            private=start.private,
            is_ligo_job=True
        )
        cwfollowup_job.save()

        job_data = Data(
            job=cwfollowup_job,
            data_choice=data.data_choice,
            source_dataset=data.source_dataset
        )

        job_data.save()

        for key, val in data_parameters.items():
            DataParameter(job=cwfollowup_job, data=job_data, name=key, value=val).save()

        job_search = Search(
            job=cwfollowup_job,
        )

        job_search.save()

        for key, val in search_parameters.items():
            SearchParameter(job=cwfollowup_job, search=job_search, name=key, value=val).save()

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
        params = cwfollowup_job.as_json()

        # Construct the request parameters to the job controller, note that parameters must be a string, not an objects
        data = {
            "parameters": json.dumps(params),
            "cluster": "ozstar",
            "bundle": "0992ae26454c2a9204718afed9dc7b3d11d9cbf8"
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
        cwfollowup_job.job_controller_id = result["jobId"]
        cwfollowup_job.save()

        return cwfollowup_job


def update_cwfollowup_job(job_id, user, private=None, labels=None):
    cwfollowup_job = CwFollowupJob.get_by_id(job_id, user)

    if user.user_id == cwfollowup_job.user_id:
        if labels is not None:
            cwfollowup_job.labels.set(Label.filter_by_name(labels))

        if private is not None:
            cwfollowup_job.private = private

        cwfollowup_job.save()

        return 'Job saved!'
    else:
        raise Exception('You must own the job to change the privacy!')
