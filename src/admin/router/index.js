import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

// import the admin app page components
import Settings from 'admin/views/Settings.vue'

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Settings',
            component: Settings,
            props: {
                biq_sk
            }
        }
    ]
})
