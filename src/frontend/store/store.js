import Vuex from "vuex";
import Vue from "vue";
import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        price: 0
    },
    mutations: {
        setPrice (state,price) {
            state.price=price
        }
    },
    plugins: [
        createPersistedState({
            getState: (key) => Cookies.getJSON(key),
            setState: (key, state) => Cookies.set(key, state, { expires: 3, secure: true })
        })
    ]
})
export default store;
