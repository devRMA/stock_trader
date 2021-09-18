<template>
    <v-app>
        <transition name="fade" appear mode="out-in">
            <Preloader v-if="loading" />
            <div v-else>
                <template v-if="$vuetify.breakpoint.smAndUp">
                    <NavBar />
                    <v-main>
                        <Rank />
                        <v-container>
                            <transition name="slide-y" mode="out-in">
                                <router-view />
                            </transition>
                        </v-container>
                    </v-main>
                </template>
                <template v-else>
                    <v-card
                        height="90%"
                        width="90%"
                        class="ma-auto mt-3 rounded"
                    >
                        <v-card-text>
                            <h1>
                                Desculpe, mas o site não funciona em mobile.
                            </h1>
                            <div class="d-flex justify-center mt-6">
                                <v-img
                                    src="https://cdn.discordapp.com/emojis/436891446881026048.gif"
                                    lazy-src="https://cdn.discordapp.com/emojis/436891446881026048.gif"
                                    max-width="100"
                                    class="rounded"
                                >
                                    <template v-slot:placeholder>
                                        <v-row
                                            class="fill-height ma-0"
                                            align="center"
                                            justify="center"
                                        >
                                            <v-progress-circular
                                                indeterminate
                                                color="grey lighten-5"
                                            ></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>
                            </div>
                        </v-card-text>
                    </v-card>
                </template>
            </div>
        </transition>
    </v-app>
</template>

<script>
    import { mapActions } from "vuex";
    import Preloader from "@/components/Preloader.vue";
    import NavBar from "@/components/NavBar.vue";
    import Rank from "@/components/Rank.vue";
    export default {
        name: "App",
        components: { Preloader, NavBar, Rank },
        data: () => ({
            loading: true,
            intervalProfile: null,
        }),
        methods: {
            ...mapActions(["loginAction", "logoutAction"]),
            refreshProfile() {
                this.$http
                    .get("/profile/@me")
                    .then((resp) => {
                        this.loginAction(resp.data);
                    })
                    .catch((error) => {
                        if (error.response.status === 401) {
                            this.logoutAction();
                        } else {
                            this.alert = {
                                show: true,
                                color: "error",
                                message:
                                    "Ops, ocorreu um erro inesperado, por favor, reporte este erro para o desenvolvedor.",
                                timeout: -1,
                            };
                            console.log("Erro inesperado");
                            console.log(
                                "For favor, reporte este erro: ",
                                error.response
                            );
                        }
                    });
            },
        },
        mounted() {
            setTimeout(() => {
                this.$http.get("/ping");
                if (this.$cookies.isKey("token")) {
                    this.$http
                        .get("/profile/@me")
                        .then((resp) => {
                            this.loginAction(resp.data);
                            this.loading = false;
                        })
                        .catch((error) => {
                            if (error.response.status === 401) {
                                this.logoutAction();
                            } else {
                                this.alert = {
                                    show: true,
                                    color: "error",
                                    message:
                                        "Ops, ocorreu um erro inesperado, por favor, reporte este erro para o desenvolvedor.",
                                    timeout: -1,
                                };
                                console.log("Erro inesperado");
                                console.log(
                                    "For favor, reporte este erro: ",
                                    error.response
                                );
                            }
                        });
                    this.intervalProfile = setInterval(() => {
                        this.refreshProfile();
                    }, 10000);
                } else {
                    this.loading = false;
                }
            }, 1000);
        },
        beforeDestroy() {
            if (this.intervalProfile) {
                clearInterval(this.intervalProfile);
            }
        },
    };
</script>
<style>
    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @keyframes fade-out {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    .fade-enter-active {
        animation: fade-in 1s ease;
    }
    .fade-leave-active {
        animation: fade-out 1s ease;
    }

    @keyframes slide-y-in {
        from {
            opacity: 0;
            transform: translateY(-30%);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes slide-y-out {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-30%);
        }
    }
    .slide-y-enter-active {
        animation: slide-y-in 400ms ease;
    }
    .slide-y-leave-active {
        animation: slide-y-out 400ms ease;
    }

    @keyframes flip-y-out {
        from {
            transform: rotateY(0deg);
        }
        to {
            transform: rotateY(90deg);
        }
    }

    @keyframes flip-y-in {
        from {
            transform: rotateY(90deg);
        }
        to {
            transform: rotateY(0deg);
        }
    }

    .flip-y-enter-active {
        animation: flip-y-in 300ms ease;
    }

    .flip-y-leave-active {
        animation: flip-y-out 300ms ease;
    }
</style>