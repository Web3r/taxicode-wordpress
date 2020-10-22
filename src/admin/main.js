import Vue from 'vue'
import App from './App.vue'
import router from './router'
import menuFix from './utils/admin-menu-fix'
import axios from 'axios';
window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#vue-admin-app',
  router,
  render: h => h(App)
});


// fix the admin menu for the slug "taxicode-app"
menuFix('taxicode-app');
