import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

// import the app page components
// import Home from 'admin/pages/Home.vue'
// import Settings from 'admin/pages/Settings.vue'
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
