
const BIQSearch = {
    
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
            commit('searchingQuotesFor', details);
            dispatch('quoting', null, { root : true });
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
            state.search_details = details;
            console.log({...state});
            console.groupEnd();
        },
        
        displaying(state, quotes) {
            console.group("BIQSearchStore quoted state");
            console.log({...state});
            console.log({...quotes});
            state.display_quotes = quotes;
            console.log({...state});
            console.groupEnd();
        }    
    }
};

export default BIQSearch;