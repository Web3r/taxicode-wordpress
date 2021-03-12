import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// import the app page components
import HomePage from 'frontend/views/HomePage.vue';
import CheckoutPage from 'frontend/views/CheckoutPage.vue';
// @todo make the component load async to reduce chunk size
import CompletePage from 'frontend/views/CompletePage.vue';

export default new Router({
    routes: [
        {
            path: '/',
            name: 'HomePage',
            component: HomePage,
            props: {
                searchFormData,
                searchOnLoad
            }
        },
        {
            path: '/:journey',
            name: 'HomePageSearched',
            component: HomePage,
            props: {
                searchFormData,
                searchOnLoad
            }
        },
        {
            path: '/checkout/:journey/:quote/:vehicle',
            name: 'CheckoutPage',
            component: CheckoutPage,
            props: {
                stripe_cardform_style,
                paypalClientToken
            }
        },
        {
            path: '/complete/:booking_ref',
            name: 'CompletePage',
            // @todo make the component load async to reduce chunk size
            component: CompletePage
        }
    ]
});
