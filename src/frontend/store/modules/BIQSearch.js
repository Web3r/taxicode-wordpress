// define a function to add leading zeros to the date time values for string value use
const az = i => (i<10) ? i="0"+i : i;
// create a new date to initialise the search form date & time fields
const d = new Date();
// just put the date & time forward a little
d.setDate(d.getDate() + 1);
d.setHours(d.getHours() + 2);
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
        validation_errors : {

        },
        display_quotes : []
    };
};

// define the state store module
const BIQSearch = {
    state : defaultState(),
    
    getters : {
        searchDetails : (state) => state.search_details,
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
            commit('displaying', journey.display);
        }
    },

    mutations : {
        resetSearchState(state) {
            console.group("Resetting BIQSearchStore State");
            console.info({...state});
            // reset the state to the initial state
            Object.assign(state, defaultState());
            console.info({...state});
            console.groupEnd();
        },

        searchingQuotesFor(state, details) {
            console.group("BIQSearchStore search details state");
            console.info({...state});
            console.info(details);
            // set the search form state details
            state.search_details = details;
            console.info({...state});
            console.groupEnd();
        },
        
        displaying(state, quotes) {
            console.group("BIQSearchStore displaying quotes state");
            console.info({...state});
            console.info({...quotes});
            // set the search results quotes to display 
            state.display_quotes = quotes;
            console.info({...state});
            console.groupEnd();
        }
    }
};

export default BIQSearch;