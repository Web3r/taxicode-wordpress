import { DEFAULT_SORT, formatQuotes, reduceToTypeAndClass } from '@/common/BIQ/QuotesFormatter';

// create a new date to initialise the search form date & time fields
const d = new Date();
// just put the date & time forward a little
d.setDate(d.getDate() + 1);
d.setHours(d.getHours() + 2);

// define a function to add leading zeros to the date time values for string value use
const az = i => (i<10) ? i="0"+i : i;

// define the default initial state structure & values
const defaultState = () => {
    return {
        search_details : {
            journey_type : 'One Way',
            pickup : '',
            vias : [], 
            destination : '', 
            // getMonth is zero based, getDate is not
            date : d.getFullYear() + "-" + az(d.getMonth() +1) + "-" + az(d.getDate()), 
            time : az(d.getHours()) + ":" + az(d.getMinutes()) + ":" + az(d.getSeconds()), 
            people : '1',
            returning : {
                date : '', 
                time : '', 
            }
        },
        results : false,
        display_type : '',
        display_quotes : []
    };
};

// define the state store module
const SearchStateStore = {
    state : defaultState(),
    
    getters : {
        searchDetails : (state) => state.search_details,
        hasSearchResults : (state) => state.results,
        displayType : (state) => state.display_type,
        displayQuotes : (state) => state.display_quotes
    },
    
    actions : {
        resetSearch({ commit, dispatch }) {
            // inform the quotes store module to reset its state
            dispatch('resetQuotes', null, { root : true });
            // reset the search state
            commit('resetSearchState');
        },

        searchingQuotes({ commit, dispatch }, details) {
            // reset the search state
            commit('resetSearchState');
            // inform the quotes store module the API Quotes are being searched
            dispatch('quoting', null, { root : true });
            // set the search details being quoted for
            commit('searchingQuotesFor', details);
        },
        
        searchedQuotes({ commit, dispatch }, journey) {
            // inform the quotes store module of the API journey quotes response
            dispatch('quoted', journey, { root : true });
            // set the quotes to be displayed in the results
            if(Object.keys(journey.quotes).length > 0) {
                const payload = {
                    type : journey.display_type,
                    // determine the quotes to display from the quote results based on the setting type
                    quotes : (journey.display_type == 'type_class')
                        ? reduceToTypeAndClass(journey.quotes) 
                        : formatQuotes(journey.quotes, journey.display_type, DEFAULT_SORT)
                };
                commit('displaying', payload);
            }
        },

        changeDisplayType({ commit, rootGetters }, type) {
            const payload = {
                type,
                // determine the quotes to display from the quote results based on the setting type
                quotes : (type == 'type_class')
                    ? reduceToTypeAndClass(rootGetters.journeyQuotes) 
                    : formatQuotes(rootGetters.journeyQuotes, type, DEFAULT_SORT)
            };
            commit('displaying', payload);
        }
    },

    mutations : {
        resetSearchState(state) {
            // reset the state to the initial state
            Object.assign(state, defaultState());
        },

        searchingQuotesFor(state, details) {
            // set the search form state details
            state.search_details = details;
        },
        
        displaying(state, payload) {
            // set the search results quotes to display 
            state.display_quotes = payload.quotes;
            state.display_type = payload.type;
            // set the flag to indicate quote results can be displayed
            state.results = true;
        }
    }
};

export default SearchStateStore;
