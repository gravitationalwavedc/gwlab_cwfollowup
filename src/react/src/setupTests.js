import React from 'react';
import { setHarnessApi } from './index';
import { createMockEnvironment } from 'relay-test-utils';
import { RouterContext } from 'found';

// This ignores the jest global variable from eslint errors.
/* global global */

// Global imports for tests
import '@testing-library/jest-dom/extend-expect';

const environment = createMockEnvironment();

setHarnessApi({
    getEnvironment: () => environment,
    currentUser: {
        userId: 1
    }
});

global.router = {
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    createHref: jest.fn(),
    createLocation: jest.fn(),
    isActive: jest.fn(),
    matcher: {
        match: jest.fn(),
        getRoutes: jest.fn(),
        isActive: jest.fn(),
        format: jest.fn()
    },
    addTransitionHook: jest.fn(),
    addNavigationListener: jest.fn(),
};

global.TestRouter = ({children}) => {
    const routerContext = {router: router, match: {}};
    return <RouterContext.Provider value={routerContext}>
        {children}
    </RouterContext.Provider>;
};

global.environment = environment;
