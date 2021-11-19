import uuid
import mock
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from graphql_relay import to_global_id

from cwfollowup.models import FileDownloadToken, CWFollowupJob
from cwfollowup.tests.test_utils import silence_errors
from cwfollowup.tests.testcases import CwFollowupTestCase

User = get_user_model()


class TestResultFilesAndGenerateFileDownloadIds(CwFollowupTestCase):
    def setUp(self):
        self.maxDiff = 9999

        self.user = User.objects.create(username="buffy", first_name="buffy", last_name="summers")
        self.client.authenticate(self.user)

        self.job = CWFollowupJob.objects.create(
            user_id=self.user.id,
            name="Test1",
            description="first job",
            job_controller_id=2,
            private=False
        )
        self.global_id = to_global_id("CWFollowupJobNode", self.job.id)

        self.files = [
            {'path': '/a', 'isDir': True, 'fileSize': "0"},
            {'path': '/a/path', 'isDir': True, 'fileSize': "0"},
            {'path': '/a/path/here2.txt', 'isDir': False, 'fileSize': "12345"},
            {'path': '/a/path/here3.txt', 'isDir': False, 'fileSize': "123456"},
            {'path': '/a/path/here4.txt', 'isDir': False, 'fileSize': "1234567"}
        ]

        self.query = f"""
            query {{
                cwfollowupResultFiles (jobId: "{self.global_id}") {{
                    files {{
                        path
                        isDir
                        fileSize
                        downloadToken
                    }}
                }}
            }}
            """

        self.mutation = """
                mutation ResultFileMutation($input: GenerateFileDownloadIdsInput!) {
                    generateFileDownloadIds(input: $input) {
                        result
                    }
                }
            """

    def request_file_list_mock(*args, **kwargs):
        return True, [
            {'path': '/a', 'isDir': True, 'fileSize': 0},
            {'path': '/a/path', 'isDir': True, 'fileSize': 0},
            {'path': '/a/path/here2.txt', 'isDir': False, 'fileSize': 12345},
            {'path': '/a/path/here3.txt', 'isDir': False, 'fileSize': 123456},
            {'path': '/a/path/here4.txt', 'isDir': False, 'fileSize': 1234567}
        ]

    def request_file_download_ids_mock(*args, **kwargs):
        return True, [uuid.uuid4() for _ in args[1]]

    @silence_errors
    @mock.patch('cwfollowup.models.request_file_list', side_effect=request_file_list_mock)
    @mock.patch('cwfollowup.schema.request_file_download_ids',
                side_effect=request_file_download_ids_mock)
    def test_not_uploaded_job(self, request_file_list, request_file_download_id_mock):
        # Check user must be authenticated
        self.client.authenticate(None)
        response = self.client.execute(self.query)

        self.assertEqual(response.data['cwfollowupResultFiles'], None)
        self.assertEqual(str(response.errors[0]), "You do not have permission to perform this action")

        # Check authenticated user
        self.client.authenticate(self.user)
        response = self.client.execute(self.query)

        for i, f in enumerate(self.files):
            if f['isDir']:
                self.files[i]['downloadToken'] = None
            else:
                self.files[i]['downloadToken'] = str(FileDownloadToken.objects.get(job=self.job, path=f['path']).token)

        expected = {
            'cwfollowupResultFiles': {
                'files': self.files,
            }
        }
        self.assertDictEqual(response.data, expected)

        download_tokens = [f['downloadToken'] for f in filter(lambda x: not x['isDir'], self.files)]

        # Check user must be authenticated
        self.client.authenticate(None)
        response = self.client.execute(
            self.mutation,
            {
                'input': {
                    'jobId': self.global_id,
                    'downloadTokens': [download_tokens[0]]
                }
            }
        )

        self.assertEqual(response.data['generateFileDownloadIds'], None)
        self.assertEqual(str(response.errors[0]), "You do not have permission to perform this action")

        # Check authenticated user
        self.client.authenticate(self.user)
        response = self.client.execute(
            self.mutation,
            {
                'input': {
                    'jobId': self.global_id,
                    'downloadTokens': [download_tokens[0]]
                }
            }
        )

        # Make sure the regex is parsable
        self.assertEqual(len(response.data['generateFileDownloadIds']['result']), 1)
        uuid.UUID(response.data['generateFileDownloadIds']['result'][0], version=4)

        response = self.client.execute(
            self.mutation,
            {
                'input': {
                    'jobId': self.global_id,
                    'downloadTokens': download_tokens
                }
            }
        )

        # Make sure that the UUID's are parsable
        self.assertEqual(len(response.data['generateFileDownloadIds']['result']), 3)
        uuid.UUID(response.data['generateFileDownloadIds']['result'][0], version=4)
        uuid.UUID(response.data['generateFileDownloadIds']['result'][1], version=4)
        uuid.UUID(response.data['generateFileDownloadIds']['result'][2], version=4)

        # Expire one of the FileDownloadTokens
        tk = FileDownloadToken.objects.all()[1]
        tk.created = timezone.now() - timezone.timedelta(seconds=settings.FILE_DOWNLOAD_TOKEN_EXPIRY + 1)
        tk.save()

        response = self.client.execute(
            self.mutation,
            {
                'input': {
                    'jobId': self.global_id,
                    'downloadTokens': download_tokens
                }
            }
        )

        self.assertEqual(response.data['generateFileDownloadIds'], None)
        self.assertEqual(str(response.errors[0]), "At least one token was invalid or expired.")
