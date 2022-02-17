import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FollowupCard from '../FollowupCard';
import { Formik } from 'formik';

/* global environment, router */
describe('FollowupCard component', () => {
    const TestFollowupCard = () => (
        <Formik initialValues={{test: []}}>
            <FollowupCard
                name='test'
                label='Test Label'
                value='test_value'
                description='Test description'
            />
        </Formik>
    )

    it('renders', () => {
        expect.hasAssertions();
        const { getByText, getByLabelText } = render(<TestFollowupCard />);
        expect(getByText('Test Label')).toBeInTheDocument();
        expect(getByText('Test description')).toBeInTheDocument();
        expect(getByLabelText('Off')).toBeInTheDocument();
    });
    
    it('switch works as intended', () => {
        expect.hasAssertions();
        const { getByLabelText, queryByLabelText } = render(<TestFollowupCard />);
        expect(getByLabelText('Off')).toBeInTheDocument();

        userEvent.click(getByLabelText('Off'))

        expect(queryByLabelText('Off')).not.toBeInTheDocument();
        expect(getByLabelText('On')).toBeInTheDocument();
    });
});
