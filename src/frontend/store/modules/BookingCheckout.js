
const state = {
    quote_id : null,
    vehicle_index : 0,
    amount : 0,
    quote : {},
    vehicle : {}
};

const getters = {
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
};

const actions = {
    bookNow({ commit }, basket) {
        commit('buildBasket', basket);
    }
};

const mutations = {
    buildBasket(state, basket) {
        console.group("Checkout Basket");
        console.log(basket);
        console.groupEnd();
        state.quote_id = basket.quote.quote_id;
        state.vehicle_index = basket.vehicle;
        state.quote = basket.quote;
        state.vehicle = basket.quote.vehicles[basket.vehicle];
        state.amount = basket.quote.vehicles[basket.vehicle].price;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
