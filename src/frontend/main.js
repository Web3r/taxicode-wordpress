// import the dev mode flag from the common app & plugins setup 
import { devMode } from './app_setup_common';
// import the app CSS (webpack will chunk this  & auto load / include separately)
import 'frontend/static-assets/css/customized/frontend.css';
// start importing & setting up the vue app
import Vue from 'vue';

// import the vue braintree paypal plugin
import vuebraintree from 'vue-braintree';
// allow vue to use the plugin & ensure single inclusion
Vue.use(vuebraintree);

// start the import of the main BIQ app code 
import BIQApp from 'frontend/BIQApp.vue';
// import the setup main BIQ app router to use
import router from 'frontend/router';
// import the setup BIQ app state manager to use
import store from 'frontend/store';
// import the BIQ app config
import conf from 'frontend/config';

/* eslint-disable no-new */
new Vue({
    store,
    render : h => h(BIQApp, {
        props : {
            appURL : biqAppURL,
            appDebugEnabled : devMode || biqAppDebugEnabled,
            biqAppConfig : conf
        }
    }),
    el : '#biq-vue-app',
    router
});
