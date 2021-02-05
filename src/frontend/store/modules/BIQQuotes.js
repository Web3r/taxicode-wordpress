
const BIQQuotesStore = {
    
    state : {
        quoting : false,
        quotes_loaded : false,
        journey_id : null,
        journey_details : {},
        journey_quotes : []
    },
    
    getters : {
        loadingQuotes : (state) => state.quoting,
        quotesLoaded : (state) => state.quotes_loaded,
        zeroQuotes : (state) => {
            if(!state.quotes_loaded) {
                return false;
            }
            return (state.journey_quotes.length === 0);
        },
        journeyID : (state) => state.journey_id,
        journeyDetails : (state) => state.journey_details,
        journeyQuotes : (state) => state.journey_quotes
    },
    
    actions : {
        
        quoting({ commit }) {
            commit('searching');
        },
        
        quoted({ commit }, journey) {
            commit('quotes', journey);
        }
    },
    
    mutations : {
        
        searching(state) {
            console.group("BIQQuotesStore resetting quoted state");
            console.log({...state});
            state.quoting = true;
            state.quotes_loaded = false;
            state.journey_id = null;
            state.journey_details = {};
            state.journey_quotes = [];
            console.log({...state});
            console.groupEnd();
        },
        
        quotes(state, journey) {
            console.group("BIQQuotesStore quoted state");
            console.log(journey);
            console.groupEnd();
            state.journey_id = journey.id;
            state.journey_quotes = journey.quotes;
            state.quoting = false;
            state.quotes_loaded = true;
        }
    }
};

export default BIQQuotesStore;