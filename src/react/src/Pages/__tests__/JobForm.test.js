import React from 'react';
import { MockPayloadGenerator } from 'relay-test-utils';
import { QueryRenderer, graphql } from 'react-relay';
import { render, fireEvent, waitFor } from '@testing-library/react';
import JobForm from '../JobForm';
import 'regenerator-runtime/runtime';

/* global router, environment */

describe('new Job Page', () => {

    // const TestRenderer = () => (
    //     <QueryRenderer
    //         environment={environment}
    //         query={graphql`
    //         query JobFormTestQuery (
    //           $jobId: ID!
    //         )
    //         @relay_test_operation {
    //             ...JobForm_data @arguments(jobId: $jobId)
    //         }
    //       `}
    //         variables={{
    //             jobId: 'testId'
    //         }}
    //         render={({ error, props}) => {
    //             if (props) {
    //                 return <JobForm data={props} match={{location: {state: {jobId: 'testId'}}}} router={router}/>;
    //             } else if (error) {
    //                 return error.message;
    //             }
    //             return 'Loading...';
    //         }}
    //     />
    // );

    it('should send a mutation when the form is submitted', async () => {
        expect.hasAssertions();
        const { getAllByText } = render(<JobForm match={{}} router={router}/>);
        fireEvent.click(getAllByText('Submit')[0]);
        await waitFor(
            () => environment.mock.resolveMostRecentOperation(
                operation => MockPayloadGenerator.generate(operation)
            )
        );
        expect(router.replace).toHaveBeenCalledWith('/cwfollowup/job-results/<mock-value-for-field-"jobId">/');
    });

    it('should navigate between tabs', async () => {
        expect.hasAssertions();
        const {  getByTestId, getAllByText } = render(<JobForm match={{}} router={router}/>);
        const followupsPane = getByTestId('followupsPane');
        expect(followupsPane).toHaveAttribute('aria-hidden', 'true');
        const followupsNavButton = getAllByText('Followups')[1];
        fireEvent.click(followupsNavButton);
        expect(followupsPane).toHaveAttribute('aria-hidden', 'false');
    });
});

