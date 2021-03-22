import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// import the app page components
import HomePage from 'frontend/views/HomePage.vue';

export default new Router({
    routes : [
        {
            path : '/',
            name : 'HomePage',
            component : HomePage,
            props : {
                searchFormData,
                searchOnLoad
            }
        },
        {
            path : '/:journey',
            name : 'HomePageSearched',
            component : HomePage,
            props : {
                searchFormData,
                searchOnLoad
            }
        },
        {
            path : '/checkout/:journey/:quote/:vehicle',
            name : 'CheckoutPage',
            // make the component load async to reduce chunk size
            component : () => import(/* webpackChunkName: "BIQCheckout" */ 'frontend/views/CheckoutPage.vue'),
            props : {
                stripe_cardform_style,
                paypalClientToken
            }
        },
        {
            path : '/complete/:booking_ref',
            name : 'CompletePage',
            // make the component load async to reduce chunk size
            component : () => import(/* webpackChunkName: "BIQComplete" */ 'frontend/views/CompletePage.vue')
        }
    ]
});
