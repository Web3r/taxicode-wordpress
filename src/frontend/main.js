import Vue from 'vue'
import Vuex from 'vuex'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlane,faTrain,faMapMarkerAlt,faUsers,faSuitcase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {  } from 'bootstrap-vue'
import vuebraintree from 'vue-braintree'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


library.add(faPlane,faTrain,faMapMarkerAlt,faUsers,faSuitcase)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import App from './App.vue'
import router from './router'


const config = require('./config.js');
window.config = config;



Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Vuex)

Vue.use(VueBootstrapTypeahead)
Vue.use(vuebraintree)

Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import store from './store/store.js'

/* eslint-disable no-new */
new Vue({
  el: '#vue-frontend-app',
  router,
  store,
  render: h => h(App)
})
