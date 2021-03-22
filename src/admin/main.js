// determine if the app is in dev or production mode
const devMode = process.env.NODE_ENV !== 'production';

// start importing & setting up the vue app
import Vue from 'vue';
Vue.config.productionTip = false;
// allow the use of dev tools before the vuex store is created
Vue.config.devtools = devMode;

// fix the admin menu for the slug "taxicode-app"
import menuFix from 'admin/utils/admin-menu-fix';
menuFix('taxicode-app');

window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// start the import of the admin app code 
import BIQAdminApp from 'admin/BIQAdminApp.vue';
import router from 'admin/router';

/* eslint-disable no-new */
new Vue({
    render : h => h(BIQAdminApp, {
        props : {
            biqAppURL,
            biqAppDebugEnabled : devMode || biq_app_debug_enabled
        }
    }),
    el : '#biq-admin-vue-app',
    router
});
