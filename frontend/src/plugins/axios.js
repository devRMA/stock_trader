import Vue from "vue";
import axios from "axios";
import store from "../store/index";
import router from "../router/index";

axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.headers.common["Accept"] = "application/json";

Vue.use({
    install(Vue) {
        Vue.prototype.$http = axios;

        Vue.prototype.$http.interceptors.request.use(
            (config) => {
                if (Vue.$cookies.isKey("token")) {
                    config.headers[
                        "Authorization"
                    ] = `Bearer ${Vue.$cookies.get("token")}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        Vue.prototype.$http.interceptors.response.use(
            (resp) => {
                return resp;
            },
            (error) => {
                if (error.response.status === 401) {
                    store.dispatch("tokenExpired");
                    router.push({ name: "Login" });
                } else {
                    return Promise.reject(error);
                }
            }
        );
    },
});
