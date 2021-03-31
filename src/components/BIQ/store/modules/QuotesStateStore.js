// import the methods to generate the default state structure & journey detail objects
import { defaultState, journeyDetails } from '@/common/BIQ/QuotesSearched';
// import the methods to display the journey date & times
import { journeyDateString, journeyTimeString } from '@/common/BIQ/QuoteCheckout';

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
        journeyDate : (state) => journeyDateString(state.journey_details.date),
        journeyTime : (state) => journeyTimeString(state.journey_details.date),
        journeyReturnDate : (state) => state.journey_details.return && journeyDateString(state.journey_details.return),
        journeyReturnTime : (state) => state.journey_details.return && journeyTimeString(state.journey_details.return),
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
            state.journey_details = journeyDetails(payload.journey);
            // set a flag to indicate API quotes have been loaded for use
            state.quotes_loaded = true;
        }
    }
};
// export the default state store module
export default QuotesStateStore;
