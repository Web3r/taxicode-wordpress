// determine if the app is in dev or production mode
const devMode = process.env.NODE_ENV !== 'production';

// start importing & setting up the vue app
import Vue from 'vue';
Vue.config.productionTip = false;
// allow the use of dev tools before the vuex store is created
Vue.config.devtools = devMode;
// import the app CSS (webpack will chunk this  & auto load / include separately)
import 'admin/static-assets/less/main.less';

// fix the admin menu for the slug "taxicode-app"
import menuFix from 'admin/utils/admin-menu-fix';
menuFix('biq-client-app');

window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// start the import of the admin app code 
import BIQAdminApp from 'admin/BIQAdminApp.vue';
import router from 'admin/router';

/* eslint-disable no-new */
new Vue({
    render : h => h(BIQAdminApp, {
        props : {
            adminNonce : admin_nonce,
            appURL : biqAppURL,
            appAssetURL : biqAppAssetsURL,
            appDebugEnabled : devMode || biqAppDebugEnabled
        }
    }),
    el : '#biq-admin-vue-app',
    router
});
