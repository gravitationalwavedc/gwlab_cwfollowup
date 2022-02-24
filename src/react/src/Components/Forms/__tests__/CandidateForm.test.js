import React from 'react';
import { render, screen } from '@testing-library/react';
import 'regenerator-runtime/runtime';
import CandidateForm from '../CandidateForm';
import { Formik } from 'formik';
import initialValues from '../initialValues';
import userEvent from '@testing-library/user-event';

/* global environment */

describe('the candidate form component', () => {
    const mockPageChange = jest.fn();

    const formikWrapper = ({children}) => <Formik initialValues={initialValues}>
        {children}
    </Formik>;

    const renderTest = (props) => render(
        <CandidateForm handlePageChange={mockPageChange} {...props}/>,
        {wrapper: formikWrapper}
    );

    it('should render full page without viterbiId', () => {
        expect.hasAssertions();
        renderTest();
        expect(screen.queryByText('Frequency (Hz)')).toBeInTheDocument();
        expect(screen.queryByDisplayValue(initialValues.candidates[0].candidateFrequency)).toBeInTheDocument();
        expect(screen.queryByTestId('remove-candidate-button-0')).toBeInTheDocument();
        expect(screen.queryByText('Upload candidates from CSV')).toBeInTheDocument();
        expect(screen.queryByTestId('add-candidate-button')).toBeInTheDocument();
        expect(screen.queryByRole('button', {name: 'Followups'})).toBeInTheDocument();
    });
    
    it('should render without ability to upload candidates with viterbiId', () => {
        expect.hasAssertions();
        renderTest({viterbiId: '1'});
        expect(screen.queryByText('Frequency (Hz)')).toBeInTheDocument();
        expect(screen.queryByDisplayValue(initialValues.candidates[0].candidateFrequency)).toBeInTheDocument();
        expect(screen.queryByTestId('remove-candidate-button-0')).toBeInTheDocument();
        expect(screen.queryByText('Upload candidates from CSV')).not.toBeInTheDocument();
        expect(screen.queryByTestId('add-candidate-button')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', {name: 'Followups'})).toBeInTheDocument();
    });
    
    it('should create candidate rows', () => {
        expect.hasAssertions();
        renderTest();
        expect(screen.getAllByDisplayValue(initialValues.candidates[0].candidateFrequency)).toHaveLength(1);
        userEvent.click(screen.getByTestId('add-candidate-button'));
        expect(screen.getAllByDisplayValue(initialValues.candidates[0].candidateFrequency)).toHaveLength(2);
    });
    
    it('should delete candidate rows in correct order', () => {
        expect.hasAssertions();
        renderTest();
        // Change value of first input
        const firstInput = screen.getByDisplayValue(initialValues.candidates[0].candidateFrequency);
        userEvent.type(firstInput, '0');
        expect(firstInput).toHaveValue(1880);

        // Add new row
        userEvent.click(screen.getByTestId('add-candidate-button'));
        const secondInput = screen.getByDisplayValue(initialValues.candidates[0].candidateFrequency);
        expect(secondInput).toBeInTheDocument();

        // Remove first row
        userEvent.click(screen.getByTestId('remove-candidate-button-0'));
        expect(screen.queryByDisplayValue('1880')).not.toBeInTheDocument();
        expect(screen.queryByDisplayValue(initialValues.candidates[0].candidateFrequency)).toBeInTheDocument();
    });

    it('should allow page change', () => {
        expect.hasAssertions();
        renderTest();
        userEvent.click(screen.queryByRole('button', {name: 'Followups'}));
        expect(mockPageChange).toHaveBeenCalledWith('followups');
    });
});