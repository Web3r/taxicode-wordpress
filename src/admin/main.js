import Vue from 'vue'
Vue.config.productionTip = false;
// allow the use of dev tools before the vuex store is created
Vue.config.devtools = true;

// fix the admin menu for the slug "taxicode-app"
import menuFix from './utils/admin-menu-fix'
menuFix('taxicode-app');

import axios from 'axios';
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// start the import of the admin app code 
import BIQAdminApp from './BIQAdminApp.vue'
import router from './router'

/* eslint-disable no-new */
new Vue({
    render: h => h(BIQAdminApp, {
        props: {
            biq_app_url,
            biq_app_debug_enabled
        }
    }),
    el: '#biq-admin-vue-app',
    router
});
