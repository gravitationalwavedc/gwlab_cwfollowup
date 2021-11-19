from django.contrib.auth import get_user_model
from graphql_relay.node.node import to_global_id
from cwfollowup.models import CWFollowupJob
from cwfollowup.tests.testcases import CwFollowupTestCase
from unittest import mock

User = get_user_model()


class TestQueriesWithAuthenticatedUser(CwFollowupTestCase):
    def setUp(self):
        self.maxDiff = 9999

        self.user = User.objects.create(username="buffy", first_name="buffy", last_name="summers")
        self.client.authenticate(self.user)

    def perform_db_search_mock(*args, **kwargs):
        return True, [
            {
                'user': {
                    'id': 1,
                    'firstName': 'buffy',
                    'lastName': 'summers'
                },
                'job': {
                    'id': 1,
                    'name': 'Test1',
                    'description': 'A test job'
                },
                'history': [{'state': 500, 'timestamp': '2020-01-01 12:00:00 UTC'}],
            },
            {
                'user': {
                    'id': 1,
                    'firstName': 'buffy',
                    'lastName': 'summers'
                },
                'job': {
                    'id': 2,
                    'name': 'Test2',
                    'description': ''
                },
                'history': [{'state': 500, 'timestamp': '2020-01-01 12:00:00 UTC'}],
            }
        ]

    def request_lookup_users_mock(*args, **kwargs):
        return '', [{
            'userId': 1,
            'username': 'buffy',
            'lastName': 'summers',
            'firstName': 'buffy'
        }]

    def test_cwfollowup_job_query(self):
        """
        cwfollowupJob node query should return a single job for an autheniticated user."
        """
        job = CWFollowupJob.objects.create(user_id=self.user.id)
        global_id = to_global_id("CWFollowupJobNode", job.id)
        response = self.client.execute(
            f"""
            query {{
                cwfollowupJob(id:"{global_id}"){{
                    id
                    name
                    userId
                    description
                    jobControllerId
                    private
                    lastUpdated
                    start {{
                        name
                        description
                        private
                    }}
                }}
            }}
            """
        )
        expected = {
            "cwfollowupJob": {
                "id": global_id,
                "name": "",
                "userId": 1,
                "description": None,
                "jobControllerId": None,
                "private": False,
                "lastUpdated": job.last_updated.strftime("%Y-%m-%d %H:%M:%S UTC"),
                "start": {"name": "", "description": None, "private": False},
            }
        }
        self.assertDictEqual(
            expected, response.data, "cwfollowupJob query returned unexpected data."
        )

    def test_cwfollowup_jobs_query(self):
        """
        cwfollowupJobs query should return a list of personal jobs for an autheniticated user.
        """
        CWFollowupJob.objects.create(
            user_id=self.user.id,
            name="Test1",
            job_controller_id=2,
        )
        CWFollowupJob.objects.create(
            user_id=self.user.id,
            name="Test2",
            job_controller_id=1,
            description="A test job",
        )
        # This job shouldn't appear in the list because it belongs to another user.
        CWFollowupJob.objects.create(user_id=4, name="Test3", job_controller_id=3)
        response = self.client.execute(
            """
            query {
                cwfollowupJobs{
                    edges {
                        node {
                            userId
                            name
                            description
                        }
                    }
                }
            }
            """
        )
        expected = {
            "cwfollowupJobs": {
                "edges": [
                    {"node": {"userId": 1, "name": "Test1", "description": None}},
                    {
                        "node": {
                            "userId": 1,
                            "name": "Test2",
                            "description": "A test job",
                        }
                    },
                ]
            }
        }
        self.assertDictEqual(
            response.data, expected, "cwfollowupJobs query returned unexpected data."
        )

    @mock.patch('cwfollowup.schema.perform_db_search', side_effect=perform_db_search_mock)
    def test_public_cwfollowup_jobs_query(self, perform_db_search):
        CWFollowupJob.objects.create(
            user_id=self.user.id, name="Test1", description="first job", job_controller_id=2, private=False
        )
        CWFollowupJob.objects.create(
            user_id=self.user.id, name="Test2", job_controller_id=1, description="A test job", private=False
        )
        # This job shouldn't appear in the list because it's private.
        CWFollowupJob.objects.create(user_id=4, name="Test3", job_controller_id=3, private=True)
        response = self.client.execute(
           """
           query {
               publicCwfollowupJobs(search:"", timeRange:"all") {
                   edges {
                       node {
                           user
                           description
                           name
                           jobStatus {
                            name
                           }
                           timestamp
                           id
                       }
                    }
                }
            }
            """
        )
        expected = {'publicCwfollowupJobs':
                    {'edges': [
                        {'node': {
                            'description': 'A test job',
                            'id': 'Q1dGb2xsb3d1cEpvYk5vZGU6MQ==',
                            'name': 'Test1',
                            'jobStatus': {
                                'name': 'Completed'
                            },
                            'timestamp': '2020-01-01 12:00:00 UTC',
                            'user': 'buffy summers'
                        }},
                        {'node': {
                            'description': '',
                            'id': 'Q1dGb2xsb3d1cEpvYk5vZGU6Mg==',
                            'name': 'Test2',
                            'jobStatus': {
                                'name': 'Completed',
                            },
                            'timestamp': '2020-01-01 12:00:00 UTC',
                            'user': 'buffy summers'
                        }}
                    ]}}
        self.assertDictEqual(response.data, expected, "publicCWFollowupJobs query returned unexpected data.")
