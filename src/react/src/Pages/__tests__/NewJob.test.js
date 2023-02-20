import React from 'react';
import { MockPayloadGenerator } from 'relay-test-utils';
import { QueryRenderer, graphql } from 'react-relay';
import { render, waitFor, screen } from '@testing-library/react';
import NewJob from '../NewJob';
import 'regenerator-runtime/runtime';

/* global router, environment */

describe('new Job Page', () => {

    const TestRenderer = ({match}) => (
        <QueryRenderer
            environment={environment}
            query={graphql`
            query NewJobTestQuery (
              $groupId: ID!
            )
            @relay_test_operation {
                ...JobForm_data @arguments(groupId: $groupId)
            }
          `}
            variables={{
                groupId: match.location.state && match.location.state.candidateGroupId
            }}
            render={({ error, props}) => {
                if (props) {
                    return <NewJob
                        data={props}
                        match={match}
                        router={router}
                    />;
                } else if (error) {
                    return error.message;
                }
                return 'Loading...';
            }}
        />
    );

    it('renders JobForm if candidate group ID is provided in the location state', async () => {
        expect.hasAssertions();
        render(<TestRenderer match={{location: {state: {candidateGroupId: 'testId'}}}}/>);
        await waitFor(
            () => environment.mock.resolveMostRecentOperation(
                operation => MockPayloadGenerator.generate(operation)
            )
        );
        expect(screen.getByTestId('followupsPane')).toBeInTheDocument();
        expect(screen.getByTestId('reviewPane')).toBeInTheDocument();
    });
    
    it('renders banner if candidate group ID is not provided in the location state', async () => {
        expect.hasAssertions();
        render(<TestRenderer match={{location: {}}}/>);
        await waitFor(
            () => environment.mock.resolveMostRecentOperation(
                operation => MockPayloadGenerator.generate(operation)
            )
        );
        expect(screen.getByText('New Job')).toBeInTheDocument();
    });
});

