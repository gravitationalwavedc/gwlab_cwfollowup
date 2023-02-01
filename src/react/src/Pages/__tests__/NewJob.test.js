import React from 'react';
import { render } from '@testing-library/react';
import NewJob from '../NewJob';

/* global router */

describe('public Job Page', () => {
    it('renders', () => {
        expect.hasAssertions();
        const { getByText } = render(<NewJob match={{}} router={router}/>);
        expect(getByText('New Job')).toBeInTheDocument();
    });
});
