import Vue from 'vue';
// import the app router plugin
import Router from 'vue-router';

// make the component load async to reduce chunk size
const HomePageComponent = () => import(/* webpackChunkName: "BIQSearch", webpackPrefetch: true */ 'frontend/views/HomePage.vue')
const HomePage2 = () => import(/* webpackPrefetch: true */ 'frontend/pages/Home.vue')

// allow vue to use the web router plugin & ensure single inclusion
Vue.use(Router);

export default new Router({
    routes : [
        {
            path : '/',
            name : 'HomePage',
            component : HomePageComponent
        },
        {
            path : '/vx/',
            name : 'HomePage2',
            component : HomePage2
        },
        {
            path : '/:journey',
            name : 'HomePageSearched',
            component : HomePageComponent
        },
        {
            path : '/checkout/:journey/:quote/:vehicle',
            name : 'CheckoutPage',
            // make the component load async to reduce chunk size
            component : () => import(/* webpackChunkName: "BIQCheckout", webpackPrefetch: true */ 'frontend/views/CheckoutPage.vue'),
            props : {
                stripe_cardform_style,
                paypalClientToken
            }
        },
        {
            path : '/complete/:booking_ref',
            name : 'CompletePage',
            // make the component load async to reduce chunk size
            component : () => import(/* webpackChunkName: "BIQComplete", webpackPrefetch: true */ 'frontend/views/CompletePage.vue')
        }
    ]
});
