import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FollowupCard from '../FollowupCard';
import { Formik } from 'formik';

describe('the followup card component', () => {
    const formikWrapper = ({children}) => <Formik initialValues={{test: []}}>
        {children}
    </Formik>;

    const renderTest = () => render(
        <FollowupCard
            name='test'
            label='Test Label'
            value='test_value'
            description='Test description'
        />,
        {wrapper: formikWrapper}
    );


    it('renders', () => {
        expect.hasAssertions();
        renderTest();
        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
        expect(screen.getByLabelText('Off')).toBeInTheDocument();
    });
    
    it('switch works as intended', () => {
        expect.hasAssertions();
        renderTest();
        expect(screen.getByLabelText('Off')).toBeInTheDocument();

        userEvent.click(screen.getByLabelText('Off'));

        expect(screen.queryByLabelText('Off')).not.toBeInTheDocument();
        expect(screen.getByLabelText('On')).toBeInTheDocument();
    });
});
