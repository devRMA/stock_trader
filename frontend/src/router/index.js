import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import store from "@/store/index";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/portfolio",
        name: "Portfolio",
        component: () =>
            import(/* webpackChunkName: "portfolio" */ "@/views/Portfolio.vue"),
    },
    {
        path: "/stocks",
        name: "Stocks",
        component: () =>
            import(/* webpackChunkName: "stocks" */ "@/views/Stocks.vue"),
    },
    {
        path: "/login",
        name: "Login",
        component: () =>
            import(/* webpackChunkName: "login" */ "@/views/Login.vue"),
    },
    {
        path: "/register",
        name: "Register",
        component: () =>
            import(/* webpackChunkName: "register" */ "@/views/Register.vue"),
    },
    {
        path: "/profile",
        name: "Profile",
        component: () =>
            import(/* webpackChunkName: "profile" */ "@/views/Profile.vue"),
    },
    {
        path: "*",
        redirect: "/",
    },
];

const router = new VueRouter({
    mode: "history",
    routes,
});

router.beforeEach((to, from, next) => {
    switch (to.name) {
        case "Login":
        case "Register":
            if (store.state.logged) {
                next({ name: "Home" });
            }
            return next();
        case "Portfolio":
        case "Stocks":
            if (!store.state.logged) {
                next({ name: "Login" });
            }
            return next();

        default:
            return next();
    }
});

export default router;
