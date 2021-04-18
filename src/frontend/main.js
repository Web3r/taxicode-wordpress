import Vue from 'vue'
Vue.config.productionTip = false;
// allow the use of dev tools before the vuex store is created
//Vue.config.devtools = true;

import Vuex from 'vuex'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
Vue.use(VueBootstrapTypeahead);

import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faPlane, faTrain, faMapMarkerAlt, faUsers, faSuitcase);

import { faPlane, faTrain, faMapMarkerAlt, faUsers, faSuitcase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('font-awesome-icon', FontAwesomeIcon);

// is this really needed at app level? 
// should it not be imported in the checkout where it is used?
import vuebraintree from 'vue-braintree'
Vue.use(vuebraintree);

// start the import of the app code 
import BIQApp from './BIQApp.vue'
import router from './router'
import store from './store'
Vue.use(Vuex);

// environment aware config
const config = require('./config.js');

/* eslint-disable no-new */
new Vue({
    store,
    render: h => h(BIQApp, {
        props: {
            biq_app_url,
            biq_app_debug_enabled,
            biq_config: config.LIVE
        }
    }),
    el: '#biq-vue-app',
    router
});
