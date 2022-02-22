from django.test import TestCase

from gw_cwfollowup.jwt_tools import GWCloudUser
from cwfollowup.models import CWJob, CWJobCandidate, CWFollowupJob, CWFollowup
from cwfollowup.views import update_cwfollowup_job

data = {
    'job': {
        'name': 'Test Job',
        'description': 'Test job description',
    },
    'candidates': [
        {
            'source_dataset': 'o2',
            'candidate_frequency': 188.,
            'target_binary': True,
            'orbit_tp': 1238161512.786,
            'asini': 0.01844,
            'orbit_period': 4995.263
        }
    ],
    'followups': ['lines']
}


class TestCWFollowupJobModel(TestCase):
    @classmethod
    def setUpTestData(cls):
        cw_job = CWJob(
            user_id=1,
            is_uploaded=True,
        )
        cw_job.save()

        for candidate in data['candidates']:
            candidate_model = CWJobCandidate(job=cw_job, **candidate)
            candidate_model.save()

        cls.job = CWFollowupJob.objects.create(
            user_id=1,
            private=False,
            cw_job=cw_job,
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
                'candidates': data['candidates'],
                'followups': data['followups']
            }
        )


class TestCWJobModel(TestCase):
    def test_update_privacy(self):
        """
        Check that CWJob model cannot be created with both is_uploaded=True and a viterbi_id
        """
        cw_job = CWJob(
            user_id=1,
            is_uploaded=True,
        )
        cw_job.save()

        self.assertTrue(cw_job.is_uploaded)

        cw_job2 = CWJob(
            user_id=1,
            viterbi_id=1,
        )
        cw_job2.save()

        self.assertEqual(cw_job2.viterbi_id, 1)

        with self.assertRaises(Exception):
            cw_job3 = CWJob(
                user_id=1,
                is_uploaded=True,
                viterbi_id=1
            )
            cw_job3.save()


class TestCandidateModel(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.cw_job = CWJob(
            user_id=1,
            is_uploaded=True,
        )
        cls.cw_job.save()

    def test_update_privacy(self):
        """
        Check that Candidate model sets orbit_tp, asini and orbit_period None
        if the candidate is not a binary
        """
        candidate_data = data['candidates'][0]

        candidate_model_binary = CWJobCandidate(job=self.cw_job, **candidate_data)
        candidate_model_binary.save()

        self.assertEqual(candidate_model_binary.orbit_tp, candidate_data['orbit_tp'])
        self.assertEqual(candidate_model_binary.asini, candidate_data['asini'])
        self.assertEqual(candidate_model_binary.orbit_period, candidate_data['orbit_period'])

        candidate_data['target_binary'] = False
        candidate_model_not_binary = CWJobCandidate(job=self.cw_job, **candidate_data)
        candidate_model_not_binary.save()

        self.assertEqual(candidate_model_not_binary.orbit_tp, None)
        self.assertEqual(candidate_model_not_binary.asini, None)
        self.assertEqual(candidate_model_not_binary.orbit_period, None)
