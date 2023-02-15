import json

import responses
from django.conf import settings
from django.contrib.auth import get_user_model

from cwfollowup.models import CWFollowupJob
from cwfollowup.tests.testcases import CwFollowupTestCase

User = get_user_model()


class TestJobSubmission(CwFollowupTestCase):
    def setUp(self):
        self.user = User.objects.create(username="buffy", first_name="buffy", last_name="summers")
        self.client.authenticate(self.user)

        self.responses = responses.RequestsMock()
        self.responses.start()

        self.addCleanup(self.responses.stop)
        self.addCleanup(self.responses.reset)

    def test_job_submission(self):
        self.responses.add(
            responses.POST,
            settings.GWCLOUD_JOB_CONTROLLER_API_URL + "/job/",
            body=json.dumps({'jobId': 4321}),
            status=200
        )

        self.responses.add(
            responses.POST,
            settings.GWLAB_GWCANDIDATE_GRAPHQL_URL,
            body=json.dumps({"data": {"candidateGroup": {"candidatesJson": '[{"name": "test_candidate"}]'}}}),
            status=200
        )

        params = {
            "input": {
                "name": "TestJob",
                "description": "test job",
                "candidateGroupId": "Q2FuZGlkYXRlR3JvdXBOb2RlOnRlc3Q=",
                "followups": ['psd_plotter'],
            }
        }

        response = self.client.execute(
            """
            mutation NewJobMutation($input: CWFollowupJobMutationInput!) {
                newCwfollowupJob(input: $input) {
                    result {
                        jobId
                    }
                }
            }
            """,
            params
        )

        expected = {
            'newCwfollowupJob': {
                'result': {
                    'jobId': 'Q1dGb2xsb3d1cEpvYk5vZGU6MQ=='
                }
            }
        }

        self.assertDictEqual(
            expected, response.data, "create CWFollowupJob mutation returned unexpected data."
        )

        job = CWFollowupJob.objects.all().last()

        _params = params["input"]

        self.assertEqual(job.name, _params['name'])
        self.assertEqual(job.description, _params['description'])
        self.assertEqual(job.candidate_group_id, 'test')
        self.assertEqual(list(job.followups.all().values_list('followup', flat=True)), _params['followups'])
