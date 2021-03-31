import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
    routes : [
        {
            path : '/',
            name : 'SettingsPage',
            component : () => import(/* webpackChunkName: "BIQAdminSettings" */ 'admin/views/SettingsPage.vue'),
            props : {
                biq_sk,
                custom_css
            }
        }
    ]
})
