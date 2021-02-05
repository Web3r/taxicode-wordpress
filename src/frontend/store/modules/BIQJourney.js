
const state = {
    journey_id : null,
    display_quotes : []
};

const getters = {
    journeyID : (state) => state.journey_id,
    displayQuotes : (state) => state.display_quotes
};

const actions = {
    quoted({ commit }, journey) {
        commit('quotes', journey);
    }
};

const mutations = {
    quotes(state, journey) {
        console.group("quoted state");
        console.log(journey);
        console.groupEnd();
        state.journey_id = journey.id;
        state.display_quotes = journey.display;
    }    
};

export default {
    state,
    getters,
    actions,
    mutations
};
