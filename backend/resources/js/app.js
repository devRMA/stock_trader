require("./bootstrap");
import Vuetify from "vuetify";

window.Vue = require("vue").default;

Vue.use(Vuetify);

Vue.component("home", require("./components/Home.vue").default);
Vue.component("welcome", require("./components/Welcome.vue").default);

const app = new Vue({
    el: "#app",
    vuetify: new Vuetify({
        theme: {
            dark: true,
        },
    })
});
