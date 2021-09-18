<template>
    <v-app-bar app>
        <v-toolbar-title class="headline text-uppercase mr-2">
            <span class="font-weight-black">stock</span>
            <span>trader</span>
        </v-toolbar-title>

        <v-toolbar-items class="text-uppercase">
            <v-btn text :to="{ name: 'Home' }" exact>início</v-btn>
            <transition name="fade">
                <v-btn
                    text
                    :to="{ name: 'Portfolio' }"
                    v-if="$store.state.logged"
                >
                    portfólio
                </v-btn>
            </transition>
            <transition name="fade">
                <v-btn text :to="{ name: 'Stocks' }" v-if="$store.state.logged">
                    ações
                </v-btn>
            </transition>
        </v-toolbar-items>

        <v-spacer></v-spacer>

        <v-toolbar-items class="text-uppercase">
            <template v-if="!$store.state.logged">
                <v-btn text :to="{ name: 'Login' }">login</v-btn>
                <v-btn text :to="{ name: 'Register' }">cadastro</v-btn>
            </template>
            <template v-else>
                <v-menu
                    transition="slide-y-transition"
                    offset-y
                    rounded="b-xl"
                    open-on-hover
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn text v-bind="attrs" v-on="on">
                            {{ user.name }}
                            <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item :to="{ name: 'Profile' }">
                            <v-list-item-title> Perfil </v-list-item-title>
                            <v-list-item-icon>
                                <v-icon>mdi-badge-account-horizontal</v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                        <v-list-item link @click="logout">
                            <v-list-item-title> Logout </v-list-item-title>
                            <v-list-item-icon>
                                <v-icon>mdi-logout</v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-layout align-center>
                    <span>
                        Saldo: <strong>{{ user.money | money }}</strong>
                    </span>
                </v-layout>
            </template>
        </v-toolbar-items>
        <v-btn icon @click="changeTheme" class="ml-2">
            <transition name="flip-y" mode="out-in">
                <v-icon v-if="$vuetify.theme.dark" key="dark">
                    mdi-white-balance-sunny
                </v-icon>
                <v-icon v-else key="light">mdi-weather-night</v-icon>
            </transition>
        </v-btn>
    </v-app-bar>
</template>
<script>
    import { mapGetters } from "vuex";
    export default {
        methods: {
            changeTheme() {
                this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
                localStorage.setItem("dark-theme", this.$vuetify.theme.dark);
            },
            logout() {
                this.$http
                    .post("/auth/logout")
                    .then(() => {
                        this.$store.dispatch("logoutAction");
                    })
                    .catch(() => {
                        this.$store.dispatch("logoutAction");
                    });
                if (this.$route.name !== "Home")
                    this.$router.push({ name: "Home" });
            },
        },
        computed: {
            ...mapGetters(["user"]),
        },
    };
</script>