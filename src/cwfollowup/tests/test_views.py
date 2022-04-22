import json
from unittest import mock
from django.conf import settings

from cwfollowup.views import perform_viterbi_query, get_min_start_time, get_source_dataset, get_viterbi_candidates, \
    get_viterbi_result_files, get_candidate_file_data
from cwfollowup.tests.test_utils import VITERBI_FILE_LIST, VITERBI_CANDIDATE_DATA
from cwfollowup.tests.testcases import CwFollowupTestCase


class TestViterbiSchemaViews(CwFollowupTestCase):
    def setUp(self):
        self.mock_info = mock.Mock()
        self.mock_info.context.headers = None
        self.mock_info.context.method = None
        self.job_id = 1

    @mock.patch('cwfollowup.views.requests.request')
    def test_perform_viterbi_query(self, request_mock):
        request_mock.return_value.content = json.dumps({'data': 'return_data'})
        return_data = perform_viterbi_query(
            query='query',
            variables={'variable': 1},
            headers=[],
            method='POST'
        )
        request_mock.assert_called()
        self.assertEqual(return_data, 'return_data')

    @mock.patch('cwfollowup.views.perform_viterbi_query')
    def test_get_viterbi_result_files(self, result_files_mock):
        result_files_mock.return_value = {
            'viterbiResultFiles': {
                'files': VITERBI_FILE_LIST
            }
        }
        self.assertEqual(get_viterbi_result_files(self.mock_info, self.job_id), VITERBI_FILE_LIST)

    @mock.patch('cwfollowup.views.perform_viterbi_query')
    def test_get_min_start_time(self, perform_viterbi_query_mock):
        start_time = 1000
        perform_viterbi_query_mock.return_value = {
            'viterbiJob': {
                'data': {
                    'minStartTime': start_time
                }
            }
        }
        self.assertEqual(get_min_start_time(self.mock_info, self.job_id), start_time)

    @mock.patch('cwfollowup.views.get_min_start_time')
    def test_get_source_dataset(self, min_start_time_mock):
        min_start_time_mock.return_value = 1126051217
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), 'o1')
        min_start_time_mock.return_value = (1126051217 + 1137254417)/2
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), 'o1')
        min_start_time_mock.return_value = 1137254417
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), 'o1')

        min_start_time_mock.return_value = 1164556817
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), 'o2')
        min_start_time_mock.return_value = (1164556817 + 1187733618)/2
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), 'o2')
        min_start_time_mock.return_value = 1187733618
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), 'o2')

        min_start_time_mock.return_value = 1238166018
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), 'o3')
        min_start_time_mock.return_value = (1238166018 + 1269388818)/2
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), 'o3')
        min_start_time_mock.return_value = 1269388818
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), 'o3')

        min_start_time_mock.return_value = 1126051217 - 1
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), None)
        min_start_time_mock.return_value = 1137254417 + 1
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), None)

        min_start_time_mock.return_value = 1164556817 - 1
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), None)
        min_start_time_mock.return_value = 1187733618 + 1
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), None)

        min_start_time_mock.return_value = 1238166018 - 1
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), None)
        min_start_time_mock.return_value = 1269388818 + 1
        self.assertEqual(get_source_dataset(self.mock_info, self.job_id), None)

    @mock.patch('cwfollowup.views.requests.get')
    @mock.patch('cwfollowup.views.get_id_from_token')
    @mock.patch('cwfollowup.views.get_viterbi_result_files')
    def test_get_candidate_file_data(self, file_list_mock, candidate_id_mock, candidate_data_mock):
        file_list_mock.return_value = VITERBI_FILE_LIST
        candidate_id_mock.return_value = 'mock-download-id'
        candidate_data_mock.return_value.text = VITERBI_CANDIDATE_DATA

        candidate_file_data = get_candidate_file_data(self.mock_info, self.job_id)
        candidate_id_mock.assert_called_once_with(
            self.mock_info,
            self.job_id,
            "/viterbi/results_a0_phase_loglikes_scores.dat-test-token"
        )
        candidate_data_mock.assert_called_once_with(
            settings.GWCLOUD_JOB_CONTROLLER_API_URL + '/file/?fileId=' + candidate_id_mock.return_value
        )
        self.assertEqual(candidate_file_data.text, VITERBI_CANDIDATE_DATA)

    @mock.patch('cwfollowup.views.get_source_dataset')
    @mock.patch('cwfollowup.views.get_candidate_file_data')
    def test_obtain_viterbi_candidates(self, candidate_data_mock, source_dataset_mock):
        candidate_data_mock.return_value.text = VITERBI_CANDIDATE_DATA
        source_dataset_mock.return_value = 'o2'
        candidates = get_viterbi_candidates(self.mock_info, self.job_id)
        expected = [
            {
                'orbit_period': 4995.263,
                'asini': 0.01844,
                'orbit_tp': 1238160133.5651631,
                'target_binary': True,
                'candidate_frequency': 188.39773843088648,
                'source_dataset': 'o2'
            },
            {
                'orbit_period': 4995.263,
                'asini': 0.01844,
                'orbit_tp': 1238160166.1664348,
                'target_binary': True,
                'candidate_frequency': 188.80117342528672,
                'source_dataset': 'o2'
            },
            {
                'orbit_period': 4995.263,
                'asini': 0.01844,
                'orbit_tp': 1238160198.7677066,
                'target_binary': True,
                'candidate_frequency': 188.4588963880759,
                'source_dataset': 'o2'
            }
        ]

        self.assertEqual(
            expected, candidates, "Getting candidates from file returned unexpected data"
        )
