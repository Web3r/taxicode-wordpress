const location = {
    string : '',
    postcode : '',
    position : [0,0]
};
// define the default initial state structure & values
const defaultState = () => {
    return {
        quoting : false,
        quotes_loaded : false,
        api_error : false,
        journey_id : '',
        journey_details : {
            pickup : location,
            destination : location,
            vias : [],
            people : 1,
            return : false,
            date : '',
            distance : 1,
            duration : 116,
            duration_text : '1 min',
            quote_type : 'mileage',
            is_airport : false,
            hourly : false
        },
        journey_quotes : {}
    };
};

// define the state store module
const QuotesStateStore = {
    state : defaultState(),
    
    getters : {
        loadingQuotes : (state) => state.quoting,
        quotesError : (state) => state.api_error,
        quotesLoaded : (state) => state.quotes_loaded,
        zeroQuotes : (state) => {
            if(!state.quotes_loaded) {
                return false;
            }
            return (Object.keys(state.journey_quotes).length === 0);
        },
        journeyID : (state) => state.journey_id,
        journeyDetails : (state) => state.journey_details,
        journeyDate : (state) => new Date(Date.parse(state.journey_details.date)).toDateString(),
        journeyTime : (state) => new Date(Date.parse(state.journey_details.date)).toLocaleTimeString(),
        journeyReturnDate : (state) => new Date(Date.parse(state.journey_details.return)).toDateString(),
        journeyReturnTime : (state) => new Date(Date.parse(state.journey_details.return)).toLocaleTimeString(),
        journeyHasReturn : (state) => !!state.journey_details.return,
        journeyHasVias : (state) => (Array.isArray(state.journey_details.vias) && state.journey_details.vias.length > 0),
        journeyQuotes : (state) => state.journey_quotes
    },
    
    actions : {
        resetQuotes({ commit }) {
            // reset the quote state
            commit('resetQuotesState');
        },

        quoting({ commit, dispatch }) {
            // reset the quote state
            commit('resetQuotesState');
            // inform the checkout store module to reset it's state
            dispatch('resetCheckout', null, { root : true });
            // set the API loading / searching quotes state
            commit('searching');
        },

        apiQuotesError({ commit }, error) {
            // set the quotes API error message state
            commit('quotesError', { api_error : error });
            // reset the API loading / searching quotes state
            commit('searched');

        },
        
        quoted({ commit }, journey) {
            // reset the API loading / searching quotes state
            commit('searched');
            // set the journey details & quotes returned from the API
            commit('quotes', journey);
        }
    },
    
    mutations : {
        resetQuotesState(state) {
            // reset the state to the initial state
            Object.assign(state, defaultState());
        },

        searching(state) {
            // set the flag to indicate API quotes are being loading / searching has started
            state.quoting = true;
        },

        quotesError(state, payload) {
            // set the error / warning messages returned from the API quotes search
            state.api_error = payload.api_error;
        },

        searched(state) {
            // reset the flag to indicate API quotes search has finished
            state.quoting = false;
        },
        
        quotes(state, payload) {
            // set the API journey ID
            state.journey_id = payload.journey_id;
            // set the quotes returned from the API
            state.journey_quotes = payload.quotes;
           // set the API journey details
            state.journey_details = {
                pickup : payload.journey.pickup,
                destination : payload.journey.destination,
                vias : payload.journey.vias,
                people : payload.journey.people,
                return : payload.journey.return,
                date : payload.journey.date,
                distance : payload.journey.distance,
                duration : payload.journey.duration,
                duration_text : payload.journey.duration_text,
                quote_type : payload.journey.quote_type,
                is_airport : payload.journey.is_airport,
                hourly : payload.journey.hourly
            };
            // set a flag to indicate API quotes have been loaded for use
            state.quotes_loaded = true;
        }
    }
};

export default QuotesStateStore;
