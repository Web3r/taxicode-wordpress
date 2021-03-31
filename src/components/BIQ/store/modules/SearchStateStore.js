// import the method to generate the default state structure object
import { defaultState } from '@/common/BIQ/QuotesSearch';
// import the method to generate quotes display type list
import { DEFAULT_SORT, displayQuotes } from '@/common/BIQ/QuotesSearched';
/**
 * Variable name replacement to help reduce production size
 * 
 * - s = state
 * - p = payload
 */
// define the state store module
const SearchStateStore = {
    state : defaultState(),
    
    getters : {
        searchDetails : (s) => s.search_details,
        hasSearchResults : (s) => s.results,
        displayType : (s) => s.display_type,
        displayQuotes : (s) => s.display_quotes
    },
    
    actions : {
        resetSearch({ commit, dispatch }) {
            // inform the quotes store module to reset its state
            dispatch('resetQuotes', null, { root : true });
            // reset the search state
            commit('resetSearchState');
        },

        searchingQuotes({ commit, dispatch }, p) {
            // reset the search state
            commit('resetSearchState');
            // inform the quotes store module the API Quotes are being searched
            dispatch('quoting', null, { root : true });
            // set the search details being quoted for
            commit('searchingQuotesFor', p);
        },
        
        searchedQuotes({ commit, dispatch }, p) {
            // inform the quotes store module of the API journey quotes response
            dispatch('quoted', p, { root : true });
            // set the quotes to be displayed in the results
            if(Object.keys(p.quotes).length > 0) {
                commit('displaying', displayQuotes(p.quotes, p.display_type, DEFAULT_SORT));
            }
        },

        changeDisplayType({ commit, rootGetters }, p) {
            commit('displaying', displayQuotes(rootGetters.journeyQuotes, p, DEFAULT_SORT));
        }
    },

    mutations : {
        resetSearchState(s) {
            // reset the state to the initial state
            Object.assign(s, defaultState());
        },

        searchingQuotesFor(s, p) {
            // set the search form state details
            s.search_details = p;
        },
        
        displaying(s, p) {
            // set the search results quotes to display 
            s.display_quotes = p.quotes;
            s.display_type = p.type;
            // set the flag to indicate quote results can be displayed
            s.results = true;
        }
    }
};
// export the default state store module
export default SearchStateStore;
