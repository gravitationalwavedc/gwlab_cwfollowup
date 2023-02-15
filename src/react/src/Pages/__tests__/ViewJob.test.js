import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { MockPayloadGenerator } from 'relay-test-utils';
import { render, waitFor } from '@testing-library/react';
import ViewJob from '../ViewJob';
import 'regenerator-runtime/runtime';

/* global environment, router */

describe('view job page', () => {
    const ViewJobRenderer = () => (
        <QueryRenderer
            environment={environment}
            query={graphql`
            query ViewJobTestQuery($jobId: ID!) @relay_test_operation {
              ...ViewJob_data @arguments(jobId: $jobId)
            }
          `}
            variables={{
                jobId: 'QmlsYnlKb2JOb2RlOjY='
            }}
            render={({ error, props }) => {
                if (props) {
                    return <ViewJob data={props} match={{params: {jobId: 'QmlsYnlKb'}}} router={router}/>;
                } else if (error) {
                    return error.message;
                }
                return 'Loading...';
            }}
        />
    );

    const mockCWFollowupViewJobReturn = {
        CWFollowupJobNode() {
            return {
                userId:1,
                lastUpdated:'2020-10-05 04:47:02 UTC',
                start: {
                    name:'my-rad-job',
                    description:'a really cool description',
                    private:true
                },
                jobStatus: {
                    name:'Error',
                    number:'400',
                    date:'2020-10-05 04:49:58 UTC'
                },
                candidateGroup: {
                    name: 'TestName',
                    description: 'Test description',
                    nCandidates: 1
                },
                followups: [
                    'lines'
                ],
                id:'QmlsYnlKb2JOb2RlOjY='
            };
        }
    };

    const mockCWFollowupJobResultsFiles = {
        CWFollowupResultFile() {
            return {
                path: 'a_cool_path',
                isDir: false,
                fileSize: 1234,
                downloadId: 'anDownloadId'
            };
        }
    };

    it('should render a loading page', () => {
        expect.hasAssertions();
        const { getByText } = render(<ViewJobRenderer />);
        expect(getByText('Loading...')).toBeInTheDocument();
    });

    it('should render the actual page', async () => {
        expect.hasAssertions();
        const { getByText, getAllByText } = render(<ViewJobRenderer />);
        await waitFor(() => environment.mock.resolveMostRecentOperation(operation =>
            MockPayloadGenerator.generate(operation, mockCWFollowupViewJobReturn)
        ));
        await waitFor(() => environment.mock.resolveMostRecentOperation(operation =>
            MockPayloadGenerator.generate(operation, mockCWFollowupJobResultsFiles)
        ));
        expect(getByText('my-rad-job')).toBeInTheDocument();
        expect(getAllByText('a_cool_path')[0]).toBeInTheDocument();
    });

});
