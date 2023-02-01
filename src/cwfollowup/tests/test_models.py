from django.test import TestCase

from gw_cwfollowup.jwt_tools import GWCloudUser
from cwfollowup.models import CWFollowupJob, CWFollowup
from cwfollowup.views import update_cwfollowup_job

data = {
    'job': {
        'name': 'Test Job',
        'description': 'Test job description',
        'candidate_group_id': 1,
    },
    'followups': ['lines', 'psd_plotter']
}


class TestCWFollowupJobModel(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.job = CWFollowupJob.objects.create(
            user_id=1,
            private=False,
            **data['job']
        )
        cls.job.save()

        for followup in data['followups']:
            cwfollowup = CWFollowup(
                followup_job=cls.job,
                followup=followup,
            )
            cwfollowup.save()

    def test_update_privacy(self):
        """
        Check that update_cwfollowup_job view can update privacy of a job
        """
        self.assertEqual(self.job.private, False)

        user = GWCloudUser('bill')
        user.user_id = 1

        update_cwfollowup_job(self.job.id, user, True)

        self.job.refresh_from_db()
        self.assertEqual(self.job.private, True)

    def test_job_to_json(self):
        """
        Check that a CWFollowupJob object can be successfully converted to json
        """
        self.assertDictEqual(
            self.job.as_json(),
            {
                **data['job'],
                'followups': data['followups']
            }
        )
