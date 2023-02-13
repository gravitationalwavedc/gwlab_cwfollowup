import React from 'react';
import { render, screen } from '@testing-library/react';
import 'regenerator-runtime/runtime';
import ReviewJob from '../ReviewJob';
import { Formik } from 'formik';
import initialValues from '../initialValues';

describe('the review job component', () => {
    const mockPageChange = jest.fn();

    const formikWrapper = (formikProps) => 
        ({children}) => 
            <Formik {...formikProps}>
                {children}
            </Formik>;

    const mockCandidateGroup = {
        name: 'TestName',
        description: 'Test description',
        nCandidates: 1
    };

    const renderTest = (formikProps) => render(
        <ReviewJob candidateGroup={mockCandidateGroup} handlePageChange={mockPageChange}/>,
        {wrapper: formikWrapper(formikProps)}
    );

    it('should render', () => {
        expect.hasAssertions();
        renderTest({initialValues: initialValues});
        expect(screen.queryByText('Candidate Group')).toBeInTheDocument();
    });

    it('should render errors', async () => {
        expect.hasAssertions();
        renderTest({initialValues: initialValues});
        expect(screen.queryByText('Errors are present in:')).not.toBeInTheDocument();
        renderTest({initialValues: initialValues, initialErrors: {followupChoices: 'Test Error'}});
        expect(screen.queryByText('Errors are present in:')).toBeInTheDocument();
    });
});