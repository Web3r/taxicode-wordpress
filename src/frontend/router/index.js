import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

// import the app page components
import Home from 'frontend/pages/Home.vue'
import Checkout from 'frontend/pages/Checkout.vue'
import Complete from 'frontend/pages/Complete.vue'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/:journey_id',
      name: 'HomeSearch',
      component: Home
    },
    {
      path: '/checkout/:journey/:quote/:vehicle',
      name: 'Checkout',
      component: Checkout
    },
    {
      path: '/complete/:booking_ref',
      name: 'Complete',
      component: Complete
    }
  ]
});
