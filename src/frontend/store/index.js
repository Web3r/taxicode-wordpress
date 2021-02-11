import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate';

import BIQSearchStore from './modules/BIQSearch';
import BIQQuotesStore from './modules/BIQQuotes';
import BIQCheckoutStore from './modules/BIQCheckout';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        BIQSearchStore,
        BIQQuotesStore,
        BIQCheckoutStore
    },
    plugins: [
       createPersistedState({
        paths : [
          'BIQSearchStore',
          'BIQQuotesStore',
          'BIQCheckoutStore'
        ],
        storage : window.localStorage
      })
    ]
});
