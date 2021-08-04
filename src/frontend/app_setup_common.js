// determine if the app is in dev or production mode
export const devMode = process.env.NODE_ENV !== 'production';

// start importing & setting up the vue app
import Vue from 'vue';
Vue.config.productionTip = false;
// allow the use of dev tools before the vuex store is created
Vue.config.devtools = devMode;

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// allow vue to use the plugin & ensure single inclusion
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlane, faTrain, faMapMarkerAlt, faUsers, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// add the additional icons
library.add(faPlane, faTrain, faMapMarkerAlt, faUsers, faSuitcase);
// register the component globally for use
Vue.component('font-awesome-icon', FontAwesomeIcon);
