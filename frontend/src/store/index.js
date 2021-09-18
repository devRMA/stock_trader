import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        tokenExpired: false,
        registered: false,
        logged: Vue.$cookies.isKey("token"),
        user: {
            id: -1,
            name: "John Doe",
            email: "email",
            money: -1,
            actions: [
                {
                    id: -1,
                    price_purchased: -1,
                    quantity: 0,
                    company: {
                        id: -1,
                        name: "foo bar",
                        price: 0,
                    },
                },
            ],
            created_at: "00-00-0000",
            money_with_actions: 1000,
        },
    },
    mutations: {
        updateUser(state, payload) {
            state.user = payload;
        },
        updateLogged(state, payload) {
            state.logged = payload;
        },
        updateTokenExpired(state, payload) {
            state.tokenExpired = payload;
        },
        updateMoney(state, payload) {
            state.user.money = payload;
        },
        updateRegistered(state, payload) {
            state.registered = payload;
        },
    },
    actions: {
        loginAction({ commit }, payload) {
            commit("updateLogged", true);
            commit("updateTokenExpired", false);
            commit("updateRegistered", false);
            commit("updateUser", payload);
        },
        logoutAction({ commit }) {
            commit("updateLogged", false);
            commit("updateTokenExpired", false);
            commit("updateRegistered", false);
            if (Vue.$cookies.isKey("token")) {
                Vue.$cookies.remove("token");
            }
            commit("updateUser", {
                id: -1,
                name: "John Doe",
                email: "email",
                money: -1,
                actions: [],
                created_at: "00-00-0000",
            });
        },
        buy({ commit }, { stock, quantity }) {
            for (let i = 0; i < quantity; i++) {
                commit("updateMoney", this.state.user.money - stock.price);
            }
        },
        sell({ commit }, { company, quantity }) {
            for (let i = 0; i < quantity; i++) {
                commit("updateMoney", this.state.user.money + company.price);
            }
        },
        tokenExpired({ commit }) {
            commit("updateLogged", false);
            commit("updateTokenExpired", true);
            commit("updateRegistered", false);
            if (Vue.$cookies.isKey("token")) {
                Vue.$cookies.remove("token");
            }
            commit("updateUser", {
                id: -1,
                name: "John Doe",
                email: "email",
                money: -1,
                actions: [],
                created_at: "00-00-0000",
            });
        },
        registered({ commit }) {
            commit("updateRegistered", true);
        },
    },
    getters: {
        user(state) {
            return state.user;
        },
        game(state) {
            return state.user.game;
        },
        money(state) {
            return state.user.money;
        },
        actions(state) {
            return state.user.actions;
        },
        logged(state) {
            return state.logged;
        },
        tokenExpired(state) {
            return state.tokenExpired;
        },
        registered(state) {
            return state.registered;
        },
    },
    modules: {},
});
