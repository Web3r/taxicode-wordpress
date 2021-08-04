// import the dev mode flag from the common app & plugins setup 
import { devMode } from './app_setup_common';
// import the CSS specific to the search lite app (webpack will chunk this  & auto load / include separately)
import 'frontend/static-assets/less/search_lite/main.less';
// start importing & setting up the vue app
import Vue from 'vue';

// start the import of the BIQ Search Lite app code 
import BIQAppSearchLite from 'frontend/BIQAppSearchLite.vue';
// import the setup BIQ app state manager to use
import store from 'frontend/store';
// import the BIQ app config
import conf from 'frontend/config';

/* eslint-disable no-new */
new Vue({
    store,
    render : h => h(BIQAppSearchLite, {
        props : {
            appURL : biqAppURL,
            appAssetURL : biqAppAssetsURL,
            biqAppConfig : conf,
            biqSearchTarget,
            appDebugEnabled : devMode || biqAppDebugEnabled
        }
    }),
    el : '#biq-vue-app'
});
