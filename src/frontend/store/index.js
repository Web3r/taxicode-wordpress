import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate';

import BIQSearchStore from 'frontend/store/modules/BIQSearch';
import BIQQuotesStore from 'frontend/store/modules/BIQQuotes';
import BIQCheckoutStore from 'frontend/store/modules/BIQCheckout';

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
