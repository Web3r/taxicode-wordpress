// define the default initial state structure & values
const defaultState = () => {
    return {
        quoting : false,
        quotes_loaded : false,
        // @todo impliment the API Error / Warnings
        api_error : null,
        journey_id : '',
        // @todo define the details sub structure
        journey_details : {},
        journey_quotes : []
    };
};

// define the state store module
const BIQQuotes = {
    state : defaultState(),
    
    getters : {
        loadingQuotes : (state) => state.quoting,
        // @todo impliment the API Error / Warnings
        quotesLoaded : (state) => state.quotes_loaded,
        zeroQuotes : (state) => {
            if(!state.quotes_loaded) {
                return false;
            }
            return (state.journey_quotes.length === 0);
        },
        journeyID : (state) => state.journey_id,
        // @todo define the details sub structure
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
            console.group("Resetting BIQQuotesStore State");
            console.log({...state});
            // reset the state to the initial state
            Object.assign(state, defaultState());
            console.log({...state});
            console.groupEnd();
        },

        searching(state) {
            console.group("BIQQuotesStore searching quotes state");
            console.log({...state});
            // set the flag to indicate API quotes are being loading / searching has started
            state.quoting = true;
            console.log({...state});
            console.groupEnd();
        },

        quotesError(state, payload) {
            console.group("BIQQuotesStore API Error state");
            console.log({...state});
            // set the error / warning messages returned from the API quotes search
            state.api_error = payload.api_error;
            console.log({...state});
            console.groupEnd();
        },

        searched(state) {
            console.group("BIQQuotesStore searched quotes state");
            console.log({...state});
            // reset the flag to indicate API quotes search has finished
            state.quoting = false;
            console.log({...state});
            console.groupEnd();
        },
        
        quotes(state, payload) {
            console.group("BIQQuotesStore quoted state");
            console.log({...state});
            console.log({...payload});
            // set the API journey ID
            state.journey_id = payload.journey_id;
            // set the API journey details
            // @todo define the details sub structure
            state.journey_details = payload.journey_details;
            // set the quotes returned from the API
            state.journey_quotes = payload.quotes;
            // set a flag to indicate API quotes have been loaded for use
            state.quotes_loaded = true;
            console.log({...state});
            console.groupEnd();
        }
    }
};

export default BIQQuotes;