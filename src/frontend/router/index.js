import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

// import the app page components
import Home from 'frontend/views/Home.vue'
import Checkout from 'frontend/views/Checkout.vue'
import Complete from 'frontend/views/Complete.vue'

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            props: {
                searchFormData,
                search_on_load,
                quote_type
            }
        },
        {
            path: '/:journey',
            name: 'HomeSearched',
            component: Home,
            props: {
                searchFormData,
                search_on_load,
                quote_type
            }
        },
        {
            path: '/checkout/:journey/:quote/:vehicle',
            name: 'Checkout',
            component: Checkout,
            props: {
                stripe_cardform_style,
                paypal_client_token
            }
        },
        {
            path: '/complete/:booking_ref',
            name: 'Complete',
            component: Complete,
            props: {
                pageText: complete_page_text,
                restBookingDetails: `${biq_app_url}booking-details/`
            }
        }
    ]
});
