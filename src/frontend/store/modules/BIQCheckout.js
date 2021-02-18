// define the default initial state structure & values
const defaultState = () => {
    return {
        processing : false,
        processed : false,
        basket : {
            quote_id : '',
            vehicle_index : 0,
            amount : 0,
        },
        quote : {},
        vehicle : {}
    };
};

// define the state store module
const BIQCheckout = {
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
        quoteVehicleData : (state) => state.vehicle
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
        
        booked({ commit }, ref) {
            // reset the checkout state
            commit('resetCheckoutState');
            // set the journey booked checkout state
            commit('booked');
        }
    },
    
    mutations : {
        resetCheckoutState(state) {
            console.group("Resetting BIQCheckoutStore State");
            console.log({...state});
            // reset the state to the initial state
            Object.assign(state, defaultState());
            console.log({...state});
            console.groupEnd();
        },

        buildBasket(state, basket) {
            console.group("BIQCheckoutStore Build Basket state");
            console.log({...state});
            console.log({...basket});
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
            console.log({...state});
            console.groupEnd();
        },

        booked(state) {
            console.group("BIQCheckoutStore journey quote booked & paid state");
            console.log({...state});
            // set the flags to indicaate the checkout process has 
            // finished & should not be attempted again
            state.processed = true;
            state.processing = false;
            console.log({...state});
            console.groupEnd();
        }
    }
};

export default BIQCheckout;
