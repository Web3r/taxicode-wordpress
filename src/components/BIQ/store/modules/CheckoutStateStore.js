// import the method to generate the default state structure object
import { defaultState } from '@/common/BIQ/QuoteCheckout';

// define the state store module
const CheckoutStateStore = {
    state : defaultState(),
    
    getters : {
        processed : (state) => state.processed,
        processing : (state) => state.processing,
        basket : (state) => {
            return {
                quote : state.basket.quote_id,
                vehicle : state.basket.vehicle_index,
                price : state.basket.amount
            };
        },
        quoteID : (state) => state.basket.quote_id,
        vehicleIndex : (state) => state.basket.vehicle_index,
        price : (state) => state.basket.amount,
        quoteData : (state) => state.quote,
        quoteVehicleData : (state) => state.vehicle,
        bookingRef : (state) => state.booking_ref
    },
    
    actions : {
        resetCheckout({ commit }) {
            // reset the checkout state
            commit('resetCheckoutState');
        },

        bookNow({ commit }, basket) {
            // reset the checkout state
            commit('resetCheckoutState');
            // set the details to build the checkout basket content
            commit('buildBasket', basket);
        },

        booking({ commit }) {
            // set the processing flags to prevent multiple procesing
            const payload = {
                processing : true,
                processed : false
            };
            // set the checkout processing state
            commit('processing', payload);
        },

        bookingFailed({ commit }) {
            // reset the processing flags to allow further procesing attempts
            const payload = {
                processing : false,
                processed : false
            };
            // set the checkout processing state
            commit('processing', payload);
        },
        
        booked({ commit }, booking_ref) {
            // reset the checkout state
            commit('resetCheckoutState');
            // set the processing flags to prevent further procesing attempts
            const payload = {
                processing : false,
                processed : false
            };
            // set the checkout processing state
            commit('processing', payload);
            // set the booking ref
            commit('booked', { booking_ref });
        }
    },
    
    mutations : {
        resetCheckoutState(state) {
            // reset the state to the initial state
            Object.assign(state, defaultState());
        },

        buildBasket(state, basket) {
            // set the journey quote ID being booked
            state.basket.quote_id = basket.quote;
            // set the quote vehicle index
            state.basket.vehicle_index = basket.vehicle;
            // set the checkout amount based on the vehicle price returned for the quote
            state.basket.amount = basket.quote_data.vehicles[basket.vehicle].price;
            // set the journey quote details
            state.quote = basket.quote_data;
            // set the journey quote vehicle details
            state.vehicle = basket.quote_data.vehicles[basket.vehicle];
        },

        processing(state, payload) {
            // set the flags to indicate the checkout processing state
            state.processing = payload.processing;
            state.processed = payload.processed;
        },

        booked(state, payload) {
            // set the booking reference
            state.booking_ref = payload.booking_ref
        }
    }
};
// export the default state store module
export default CheckoutStateStore;
