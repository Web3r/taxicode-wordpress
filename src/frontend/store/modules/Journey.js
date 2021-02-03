
const state = {
    quoting : false,
    quotes_loaded : false,
    journey_id : null,
    journey_details : {
        journey_type : 'One Way',
        pickup : null,
        destination : null, 
        date : null, 
        time : null, 
        people : 1
    },
    journey_quotes : [],
    display_quotes : []
};

const getters = {
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
    journeyQuotes : (state) => state.journey_quotes,
    displayQuotes : (state) => state.display_quotes
};

const actions = {
    quoting({ commit }, details) {
        commit('journey', details);
    },
    quoted({ commit }, journey) {
        commit('quotes', journey);
    }
};

const mutations = {
    journey(state, details) {
        state.quoting = true;
        state.quotes_loaded = false;
        console.group("quoting state");
        console.log(details);
        console.groupEnd();
        state.journey_details = details;
    },
    quotes(state, journey) {
        console.group("quoted state");
        console.log(journey);
        console.groupEnd();
        state.journey_id = journey.id;
        state.journey_quotes = journey.quotes;
        state.display_quotes = journey.display;
        state.quoting = false;
        state.quotes_loaded = true;
    }    
};

export default {
    state,
    getters,
    actions,
    mutations
};
