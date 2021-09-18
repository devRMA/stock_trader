import "./plugins/vue-cookies";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./plugins/axios";

Vue.config.productionTip = false;

Vue.filter("money", (value) => {
    const parsedValue = parseInt(value);
    let valueFormatted = "";
    const lookup = [
        { value: 1e6, symbol: " M" },
        { value: 1e9, symbol: " B" },
        { value: 1e12, symbol: " T" },
        { value: 1e15, symbol: " Qa" },
        { value: 1e18, symbol: " Qi" },
        { value: 1e21, symbol: " S" },
    ];
    const numberRegex1 = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
    const numberRegex2 = /\.0+$|(\.[0-9]*[1-9])0+$/;
    if (parsedValue <= 1e6) {
        valueFormatted = value.toString().replace(numberRegex1, ".");
    } else {
        var item = lookup
            .slice()
            .reverse()
            .find(function (item) {
                return parsedValue >= item.value;
            });
        valueFormatted = item
            ? (parsedValue / item.value)
                  .toFixed(3)
                  .replace(numberRegex2, "$1") + item.symbol
            : "0";
    }
    return "CR$ " + valueFormatted;
});

Vue.filter("qtd", (value) => {
    const parsedValue = parseInt(value);
    let valueFormatted = "";
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "B" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "Qa" },
        { value: 1e18, symbol: "Qi" },
        { value: 1e21, symbol: "S" },
    ];
    const numberRegex = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return parsedValue >= item.value;
        });
    valueFormatted = item
        ? (parsedValue / item.value).toFixed(2).replace(numberRegex, "$1") +
          item.symbol
        : "0";
    return valueFormatted;
});

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
