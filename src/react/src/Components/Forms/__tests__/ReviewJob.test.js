import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import 'regenerator-runtime/runtime';
import ReviewJob from '../ReviewJob';
import { Formik, setIn } from 'formik';
import initialValues from '../initialValues';
import userEvent from '@testing-library/user-event';

/* global environment */

describe('the review job component', () => {
    const mockPageChange = jest.fn();

    const formikWrapper = (formikProps) => 
        ({children}) => 
            <Formik {...formikProps}>
                {children}
            </Formik>;

    const renderTest = (formikProps) => render(
        <ReviewJob handlePageChange={mockPageChange}/>,
        {wrapper: formikWrapper(formikProps)}
    );

    it('should render', () => {
        expect.hasAssertions();
        renderTest({initialValues: initialValues});
        expect(screen.queryByText('Candidate Parameters')).toBeInTheDocument();
    });

    it('should render errors', async () => {
        expect.hasAssertions();
        renderTest({initialValues: initialValues});
        expect(screen.queryByText('Errors are present in:')).not.toBeInTheDocument();
        renderTest({initialValues: initialValues, initialErrors: {followupChoices: 'Test Error'}});
        expect(screen.queryByText('Errors are present in:')).toBeInTheDocument();
    });
});