// define the default initial state structure & values
const defaultState = () => {
    return {
        quote_id : '',
        vehicle_index : 0,
        amount : 0,
        quote : {},
        vehicle : {}
    };
};

// define the state store module
const BIQCheckout = {
    state : defaultState(),
    
    getters : {
        basket : (state) => {
            return {
                quote : state.quote_id,
                vehicle : state.vehicle_index,
                price : state.amount
            };
        },
        quoteID : (state) => state.quote_id,
        vehicleIndex : (state) => state.vehicle_index,
        price : (state) => state.amount,
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
            state.quote_id = basket.quote.quote_id;
            // set the quote vehicle index
            state.vehicle_index = basket.vehicle;
            // set the journey quote details
            state.quote = basket.quote;
            // set the journey quote vehicle details
            state.vehicle = basket.quote.vehicles[basket.vehicle];
            // set the checkout amount based on the vehicle price returned for the quote
            state.amount = basket.quote.vehicles[basket.vehicle].price;
            console.log({...state});
            console.groupEnd();
        }
    }
};

export default BIQCheckout;
