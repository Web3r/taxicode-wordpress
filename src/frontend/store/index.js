import Vue from "vue";
import Vuex from "vuex";

import BIQSearchStore from './modules/BIQSearch';
import BIQQuotesStore from './modules/BIQQuotes';
//import BIQJourneyStore from './modules/BIQJourney.js'
import BIQCheckoutStore from './modules/BIQCheckout';

//import createPersistedState from 'vuex-persistedstate';
//import * as Cookies from 'js-cookie';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        BIQSearchStore,
        BIQQuotesStore,
//        BIQJourneyStore,
        BIQCheckoutStore
    },
    plugins: [
//        createPersistedState({
//            getState: (key) => Cookies.getJSON(key),
//            setState: (key, state) => Cookies.set(key, state, { expires : 3, secure : true })
//        })
    ]
});
