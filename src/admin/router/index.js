import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
console.log(search_target_permalink);
export default new Router({
    routes : [
        {
            path : '/',
            name : 'SettingsPage',
            component : () => import(/* webpackChunkName: "BIQAdminSettings" */ 'admin/views/SettingsPage.vue'),
            props : {
                biq_sk,
                custom_css,
                search_target_permalink
            }
        }
    ]
})
