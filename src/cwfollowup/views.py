import json
import requests
from django.conf import settings
from django.db import transaction

from .models import CWFollowupJob, CWFollowup, UploadedCWJob, UploadedCWJobCandidate, ViterbiJob


def perform_viterbi_query(context):
    result = requests.request(
        method=context.method,
        url=settings.GWLAB_VITERBI_GRAPHQL_URL,
        headers=context.headers,
        json=json.loads(context.body)
    )
    return json.loads(result.content)['data']


def create_followup_job(user, name, description, is_uploaded, followups, uploaded_job=None, viterbi_job=None):
    print(name, description, is_uploaded, uploaded_job, viterbi_job, followups)
    # Right now, it is not possible to create a non-ligo job
    # if not user.is_ligo:
    #     raise Exception("User must be ligo")

    with transaction.atomic():
        followup_job = CWFollowupJob(
            user_id=user.user_id,
            name=name,
            description=description,
            is_uploaded=is_uploaded
        )

        if is_uploaded:
            job = UploadedCWJob(user_id=user.user_id)
            job.save()
            candidate = UploadedCWJobCandidate(job=job, **uploaded_job)
            candidate.save()
            followup_job.uploaded_job = job
        else:
            job = ViterbiJob(user_id=user.user_id, viterbi_id=viterbi_job.viterbi_id)
            job.save()
            followup_job.viterbi_job = job

        followup_job.save()

        for followup in followups:
            cwfollowup = CWFollowup(
                followup_job=followup_job,
                followup=followup,
            )
            cwfollowup.save()

        return followup_job
