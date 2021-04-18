import Vue from "vue";
// import the state management plugin
import Vuex from "vuex";
// import the ability to create a persisted state
import createPersistedState from 'vuex-persistedstate';
// import the BIQ state management modules
import BIQStateStore from 'BIQ/store';

// allow vue to use the state management plugin & ensure single inclusion
Vue.use(Vuex);

// create the app state manager from the modules
export default new Vuex.Store({
    modules : {
        BIQSearchStateStore : BIQStateStore.search,
        BIQQuotesStateStore : BIQStateStore.quotes,
        BIQCheckoutStateStore : BIQStateStore.checkout
    },

    plugins : [
        // allow the state to persisted in the local storage (the size exceeds the max for Cookie)
        createPersistedState({
            paths : [
                'BIQSearchStateStore',
                'BIQQuotesStateStore',
                'BIQCheckoutStateStore'
            ],
            storage : window.localStorage
        })
    ]
});
