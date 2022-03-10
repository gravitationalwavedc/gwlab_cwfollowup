import './assets/styles.scss';
import getRoutes from './Routes';
import Menu from './Components/Menu';

let harnessApi = null;

function setHarnessApi(api) {
    harnessApi = api;
    harnessApi.getSecondaryMenu = () => Menu;
}

export {
    getRoutes,
    setHarnessApi,
    harnessApi
};
