import React from 'react';
import { render, screen } from '@testing-library/react';
import Menu from '../Menu';

/* global environment, router */

describe('secondary menu component', () => {
    it('renders', () => {
        expect.hasAssertions();
        render(<Menu/>, {wrapper: TestRouter});
        expect(screen.queryByText('Followups')).toBeInTheDocument();
        expect(screen.queryByText('New Followup')).toBeInTheDocument();
    });
});
