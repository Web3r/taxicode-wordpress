import Vue from "vue";
import Vuex from "vuex";

import BIQSearchStore from './modules/BIQSearch';
import BIQQuotesStore from './modules/BIQQuotes';
import BIQCheckoutStore from './modules/BIQCheckout';

import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie';

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
        // storage: {
        //   key : 'BIQ',
        //   getItem: (key) => Cookies.get(key),
        //   // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
        //   setItem: (key, value) =>
        //     Cookies.set(key, value, { expires: 3, secure: false }),
        //   removeItem: (key) => Cookies.remove(key),
        // },
      })
    ]
});
