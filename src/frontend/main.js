import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlane,faTrain,faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {  } from 'bootstrap-vue'


library.add(faPlane,faTrain,faMapMarkerAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import App from './App.vue'
import router from './router'

const config = require('./config.js');
window.config = config;



Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.use(VueBootstrapTypeahead)

Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

/* eslint-disable no-new */
new Vue({
  el: '#vue-frontend-app',
  router,
  render: h => h(App)
})
