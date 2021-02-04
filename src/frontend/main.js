import Vue from 'vue'
Vue.config.productionTip = false;
Vue.config.devtools = true;

import Vuex from 'vuex'
Vue.use(Vuex);

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
Vue.use(VueBootstrapTypeahead);

import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faPlane, faTrain, faMapMarkerAlt, faUsers, faSuitcase);

import { faPlane, faTrain, faMapMarkerAlt, faUsers, faSuitcase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('font-awesome-icon', FontAwesomeIcon);

import vuebraintree from 'vue-braintree'
Vue.use(vuebraintree);

import {  } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import router from './router'
import store from './store'

const config = require('./config.js');
window.config = config.DEV;

/* eslint-disable no-new */
new Vue({
  store,
  render: h => h(App),
  el: '#vue-frontend-app',
  router
});
