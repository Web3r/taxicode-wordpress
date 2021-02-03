import Vue from "vue";
import Vuex from "vuex";

import Journey from './modules/Journey';
import BookingCheckout from './modules/BookingCheckout';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Journey,
        BookingCheckout
    }
});