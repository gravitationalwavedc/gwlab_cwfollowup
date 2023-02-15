import React from 'react';
import { MockPayloadGenerator } from 'relay-test-utils';
import { QueryRenderer, graphql } from 'react-relay';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import JobForm from '../JobForm';
import 'regenerator-runtime/runtime';

/* global router, environment */

describe('new Job Page', () => {

    const TestRenderer = () => (
        <QueryRenderer
            environment={environment}
            query={graphql`
            query JobFormTestQuery (
              $groupId: ID!
            )
            @relay_test_operation {
                ...JobForm_data @arguments(groupId: $groupId)
            }
          `}
            variables={{
                groupId: 'testId'
            }}
            render={({ error, props}) => {
                if (props) {
                    return <JobForm
                        data={props}
                        match={{location: {state: {candidateGroupId: 'testId'}}}}
                        router={router}
                    />;
                } else if (error) {
                    return error.message;
                }
                return 'Loading...';
            }}
        />
    );

    it('should send a mutation when the form is submitted', async () => {
        expect.hasAssertions();
        render(<TestRenderer/>);
        await waitFor(
            () => environment.mock.resolveMostRecentOperation(
                operation => MockPayloadGenerator.generate(operation)
            )
        );
        fireEvent.click(screen.getByText('Submit'));
        await waitFor(
            () => environment.mock.resolveMostRecentOperation(
                operation => MockPayloadGenerator.generate(operation)
            )
        );
        expect(router.replace).toHaveBeenCalledWith('/cwfollowup/job-results/<mock-value-for-field-"jobId">/');
    });

    it('should navigate between tabs', async () => {
        expect.hasAssertions();
        render(<TestRenderer/>);
        await waitFor(
            () => environment.mock.resolveMostRecentOperation(
                operation => MockPayloadGenerator.generate(operation)
            )
        );
        const followupsPane = screen.getByTestId('followupsPane');
        const reviewPane = screen.getByTestId('reviewPane');
        expect(followupsPane).toHaveAttribute('aria-hidden', 'false');
        expect(reviewPane).toHaveAttribute('aria-hidden', 'true');
        const followupsNavButton = screen.getByText('Review and Submit');
        fireEvent.click(followupsNavButton);
        expect(followupsPane).toHaveAttribute('aria-hidden', 'true');
        expect(reviewPane).toHaveAttribute('aria-hidden', 'false');
    });
});

