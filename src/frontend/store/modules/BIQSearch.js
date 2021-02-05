
const BIQSearchStore = {
    
    state : {
        search_details : {
            journey_type : 'One Way',
            pickup : null,
            destination : null, 
            date : null, 
            time : null, 
            people : 1
        },
        display_quotes : []
    },
    
    getters : {
        searchDetails : (state) => state.search_details,
        displayQuotes : (state) => state.display_quotes
    },
    
    actions : {
        
        searchingQuotes({ commit, dispatch }, details) {
            dispatch('quoting', null, { root : true });
            commit('searchingQuotesFor', details);
        },
        
        searchedQuotes({ commit, dispatch }, journey) {
            dispatch('quoted', journey, { root : true });
            commit('displaying', journey.display);
        }
    },
    mutations : {
        
        searchingQuotesFor(state, details) {
            console.group("BIQSearchStore quoting state");
            console.log({...state});
            console.log(details);
            console.groupEnd();
            state.search_details = details;
        },
        
        displaying(state, quotes) {
            console.group("BIQSearchStore quoted state");
            console.log({...state});
            console.log(quotes);
            console.groupEnd();
            state.display_quotes = quotes;
        }    
    }
};

export default BIQSearchStore;