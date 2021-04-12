import Vue from 'vue';
// import the app router plugin
import Router from 'vue-router';

// allow vue to use the web router plugin & ensure single inclusion
Vue.use(Router);

export default new Router({
    routes : [
        {
            path : '/',
            name : 'SettingsPage',
            component : () => import(/* webpackChunkName: "BIQAdminSettings" */ 'admin/views/SettingsPage.vue')
        }
    ]
});
