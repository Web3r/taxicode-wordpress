// import the methods to generate the default state structure & journey detail objects
import { defaultState } from '@BIQ/Quotes/Searched';
// import the methods to format the provided journey data, display the journey date & times
import { journeyDetails, journeyDateString, journeyTimeString } from '@BIQ/Journey';

/**
 * Variable name replacement to help reduce production size
 * 
 * - s = state
 * - p = payload
 */
// define the state store module
const QuotesStateStore = {
    state : defaultState(),
    
    getters : {
        loadingQuotes : (s) => s.quoting,
        quotesError : (s) => s.api_error,
        quotesLoaded : (s) => s.quotes_loaded,
        zeroQuotes : (s) => {
            if(!s.quotes_loaded) {
                return false;
            }
            return (Object.keys(s.journey_quotes).length === 0);
        },
        journeyID : (s) => s.journey_id,
        journeyDetails : (s) => s.journey_details,
        journeyDate : (s) => journeyDateString(s.journey_details.date),
        journeyTime : (s) => journeyTimeString(s.journey_details.date),
        journeyReturnDate : (s) => s.journey_details.return && journeyDateString(s.journey_details.return),
        journeyReturnTime : (s) => s.journey_details.return && journeyTimeString(s.journey_details.return),
        journeyHasReturn : (s) => !!s.journey_details.return,
        journeyHasVias : (s) => (Array.isArray(s.journey_details.vias) && s.journey_details.vias.length > 0),
        journeyQuotes : (s) => s.journey_quotes
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

        apiQuotesError({ commit }, p) {
            // set the quotes API error message state
            commit('quotesError', { api_error : p });
            // reset the API loading / searching quotes state
            commit('searched');

        },
        
        quoted({ commit }, p) {
            // reset the API loading / searching quotes state
            commit('searched');
            // set the journey details & quotes returned from the API
            commit('quotes', p);
        }
    },
    
    mutations : {
        resetQuotesState(s) {
            // reset the state to the initial state
            Object.assign(s, defaultState());
        },

        searching(s) {
            // set the flag to indicate API quotes are being loading / searching has started
            s.quoting = true;
        },

        quotesError(s, p) {
            // set the error / warning messages returned from the API quotes search
            s.api_error = p.api_error;
        },

        searched(s) {
            // reset the flag to indicate API quotes search has finished
            s.quoting = false;
        },
        
        quotes(s, p) {
            // set the API journey ID
            s.journey_id = p.journey_id;
            // set the quotes returned from the API
            s.journey_quotes = p.quotes;
            // set the API journey details
            s.journey_details = journeyDetails(p.journey);
            // set a flag to indicate API quotes have been loaded for use
            s.quotes_loaded = true;
        }
    }
};
// export the default state store module
export default QuotesStateStore;
