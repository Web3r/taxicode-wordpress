import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate';

import BIQSearchStateStore from 'BIQ/store/modules/SearchStateStore';
import BIQQuotesStateStore from 'BIQ/store/modules/QuotesStateStore';
import BIQCheckoutStateStore from 'BIQ/store/modules/CheckoutStateStore';

Vue.use(Vuex);

export default new Vuex.Store({
    modules : {
        BIQSearchStateStore,
        BIQQuotesStateStore,
        BIQCheckoutStateStore
    },

    plugins : [
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
