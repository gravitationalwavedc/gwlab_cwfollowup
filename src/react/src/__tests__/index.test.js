import {setHarnessApi, harnessApi} from '../index';
import {createMockEnvironment} from 'relay-test-utils';


describe('harnessApi', () => {
    const newApi = {
        getEnvironment: () => createMockEnvironment()
    };

    it('can be set by setHarnessApi', () => {
        expect.hasAssertions();

        setHarnessApi({});

        // Check that harnessApi has only defaults
        expect(harnessApi).toHaveProperty('getSecondaryMenu');
        expect(harnessApi).not.toMatchObject(newApi);
        
        // Set the harness api to our test api
        setHarnessApi(newApi);
        
        // Confirm that the harnessApi is now correct
        expect(harnessApi).toMatchObject(newApi);

    });
});
