import React from 'react';
import { MockPayloadGenerator } from 'relay-test-utils';
import { QueryRenderer, graphql } from 'react-relay';
import { render, fireEvent } from '@testing-library/react';
import NewJob from '../NewJob';

/* global environment, router */

describe('public Job Page', () => {

    const TestRenderer = () => (
        <QueryRenderer
            environment={environment}
            query={graphql`
                query NewJobTestQuery (
                    $count: Int, 
                    $timeRange: String, 
                    $cursor: String, 
                    $search: String,
                    $orderBy: String
                ) @relay_test_operation {
                    ...NewJob_data
                }
            `}
            variables={{
                count: 10,
            }}
            render={({ error, props }) => {
                if (props) {
                    return <NewJob data={props} match={{}} router={router}/>;
                } else if (error) {
                    return error.message;
                }
                return 'Loading...';
            }}
        />
    );

    const mockReturn = {
        ViterbiPublicJobNode() {
            return {
                id: '1',
                user: 'Buffy',
                jobStatus: {name: 'complete'},
                name: 'TestJob-1',
                description: 'A test job',
                timestamp: 'timestamp'
            };
        },
        ViterbiJobNode() {
            return {
                id: '2',
                user: 'Giles',
                jobStatus: {name: 'complete'},
                name: 'TestJob-2',
                description: 'A load more job.',
                timestamp: 'timestamp'
            };
        }
    };

    it('renders', () => {
        expect.hasAssertions();
        const { getByText, queryByText } = render(<TestRenderer />);
        environment.mock.resolveMostRecentOperation(operation => 
            MockPayloadGenerator.generate(operation, mockReturn)
        );
        expect(getByText('TestJob-1')).toBeInTheDocument();
        expect(queryByText('TestJob-2')).not.toBeInTheDocument();
    });

    it('switches to user viterbi jobs', () => {
        expect.hasAssertions();
        const { getByTestId, getByText, queryByText } = render(<TestRenderer />);
        environment.mock.resolveMostRecentOperation(operation => 
            MockPayloadGenerator.generate(operation, mockReturn)
        );
        const userJobsButton = getByTestId('user-jobs-button')
        fireEvent.click(userJobsButton);
        expect(queryByText('TestJob-1')).not.toBeInTheDocument();
        expect(getByText('TestJob-2')).toBeInTheDocument();
    })
});
