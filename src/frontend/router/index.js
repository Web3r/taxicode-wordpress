import Vue from 'vue'
import Router from 'vue-router'
import Home from 'frontend/pages/Home.vue'
import Checkout from 'frontend/pages/Checkout.vue'
import Complete from 'frontend/pages/Complete.vue'

Vue.use(Router);

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
