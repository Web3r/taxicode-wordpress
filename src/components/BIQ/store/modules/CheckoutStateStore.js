// import the method to generate the default state structure object
import { defaultState } from '@BIQ/QuoteCheckout';

/**
 * Variable name replacement to help reduce production size
 * 
 * - s = state
 * - p = payload
 */
// define the state store module
const CheckoutStateStore = {
    state : defaultState(),
    
    getters : {
        processed : (s) => s.processed,
        processing : (s) => s.processing,
        basket : (s) => {
            return {
                quote : s.basket.quote_id,
                vehicle : s.basket.vehicle_index,
                price : s.basket.amount
            };
        },
        quoteID : (s) => s.basket.quote_id,
        vehicleIndex : (s) => s.basket.vehicle_index,
        price : (s) => s.basket.amount,
        quoteData : (s) => s.quote,
        quoteVehicleData : (s) => s.vehicle,
        bookingRef : (s) => s.booking_ref
    },
    
    actions : {
        resetCheckout({ commit }) {
            // reset the checkout state
            commit('resetCheckoutState');
        },

        bookNow({ commit }, p) {
            // reset the checkout state
            commit('resetCheckoutState');
            // set the details to build the checkout basket content
            commit('buildBasket', p);
        },

        booking({ commit }) {
            // set the processing flags to prevent multiple procesing
            const p = {
                processing : true,
                processed : false
            };
            // set the checkout processing state
            commit('processing', p);
        },

        bookingFailed({ commit }) {
            // reset the processing flags to allow further procesing attempts
            const p = {
                processing : false,
                processed : false
            };
            // set the checkout processing state
            commit('processing', p);
        },
        
        booked({ commit }, p) {
            // reset the checkout state
            commit('resetCheckoutState');
            // set the checkout processing state flags to prevent further procesing attempts
            commit('processing', {
                processing : false,
                processed : false
            });
            // set the booking ref
            commit('booked', { p });
        }
    },
    
    mutations : {
        resetCheckoutState(s) {
            // reset the state to the initial state
            Object.assign(s, defaultState());
        },

        buildBasket(s, p) {
            // set the journey quote ID being booked
            s.basket.quote_id = p.quote;
            // set the quote vehicle index
            s.basket.vehicle_index = p.vehicle;
            // set the checkout amount based on the vehicle price returned for the quote
            s.basket.amount = p.quote_data.vehicles[p.vehicle].price;
            // set the journey quote details
            s.quote = p.quote_data;
            // set the journey quote vehicle details
            s.vehicle = p.quote_data.vehicles[p.vehicle];
        },

        processing(s, p) {
            // set the flags to indicate the checkout processing state
            s.processing = p.processing;
            s.processed = p.processed;
        },

        booked(s, p) {
            // set the booking reference
            s.booking_ref = p.booking_ref
        }
    }
};
// export the default state store module
export default CheckoutStateStore;
