import React from 'react';
import CSVUpload from '../CSVUpload';
import { render, screen } from '@testing-library/react';
import 'regenerator-runtime/runtime';

/* global environment */

describe('the label dropdown component', () => {
    const saveData = jest.fn();
    const checkData = jest.fn();

    const TestRenderer = () => <CSVUpload saveData={saveData} checkData={checkData} text='Test Upload'/>;

    it('should render', () => {
        expect.hasAssertions();
        render(<TestRenderer />);
        expect(screen.queryByText('Test Upload')).toBeInTheDocument();   
    });
});
