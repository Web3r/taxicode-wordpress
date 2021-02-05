
const BIQCheckoutStore = {
    
    state : {
        quote_id : null,
        vehicle_index : 0,
        amount : 0,
        quote : {},
        vehicle : {}
    },
    
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
        
        bookNow({ commit }, basket) {
            commit('buildBasket', basket);
        },
        
        booked({ commit }, ref) {
             commit('emptyBasket');
        }
    },
    mutations : {
        
        buildBasket(state, basket) {
            console.group("BIQCheckoutStore Build Basket");
            console.log(basket);
            console.groupEnd();
            state.quote_id = basket.quote.quote_id;
            state.vehicle_index = basket.vehicle;
            state.quote = basket.quote;
            state.vehicle = basket.quote.vehicles[basket.vehicle];
            state.amount = basket.quote.vehicles[basket.vehicle].price;
        },
        
        emptyBasket(state) {
            console.group("BIQCheckoutStore Empty Checkout Basket");
            console.log({...state});
            state.quote_id = null;
            state.vehicle_index = 0;
            state.quote = {};
            state.vehicle = {};
            state.amount = 0;        
            console.log({...state});
            console.groupEnd();
        }
    }
};

export default BIQCheckoutStore;
