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
      component: Home,
      props : {
        postData,
        quote_type
      }
    },
    {
      path: '/:journey',
      name: 'HomeSearched',
      component: Home,
      props : {
        postData,
        quote_type
      }
    },
    {
      path: '/checkout/:journey/:quote/:vehicle',
      name: 'Checkout',
      component: Checkout,
      props : {
        tc_public_key,
        paypal_key,
        gateway_api_key,
        test_mode
      }
    },
    {
      path: '/complete/:booking_ref',
      name: 'Complete',
      component: Complete
    }
  ]
});
