
const BIQQuotes = {
    
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
        journeyDate : (state) => new Date(Date.parse(state.journey_details.date)).toDateString(),
        journeyTime : (state) => new Date(Date.parse(state.journey_details.date)).toLocaleTimeString(),
        journeyReturnDate : (state) => new Date(Date.parse(state.journey_details.return)).toDateString(),
        journeyReturnTime : (state) => new Date(Date.parse(state.journey_details.return)).toLocaleTimeString(),
        journeyHasReturn : (state) => !!state.journey_details.return,
        journeyHasVias : (state) => (state.journey_details.vias.length > 0),
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
        
        quotes(state, payload) {
            console.group("BIQQuotesStore quoted state");
            console.log({...state});
            console.log({...payload});
            state.journey_id = payload.journey_id;
            state.journey_details = payload.journey_details;
            state.journey_quotes = payload.quotes;
            state.quoting = false;
            state.quotes_loaded = true;
            console.log({...state});
            console.groupEnd();
        }
    }
};

export default BIQQuotes;