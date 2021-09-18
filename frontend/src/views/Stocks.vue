<template>
    <div class="mt-6">
        <v-snackbar
            v-model="alert.show"
            :color="alert.color"
            top
            right
            elevation="10"
            :timeout="alert.timeout"
            app
        >
            {{ alert.message }}
            <template v-slot:action="{ attrs }">
                <v-btn icon v-bind="attrs" @click="alert.show = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
        <transition name="slide-y" mode="out-in">
            <div key="loading" v-if="loading">
                <Loading
                    text="Carregando as ações..."
                    class="ml-auto mr-auto"
                />
            </div>
            <div class="stocks" key="stocks" v-else>
                <Stocks :stocks="stocks" @buyStock="buyStock" />
                <ResetTime
                    :secondsToReset="secondsToReset"
                    @end="refreshStocks"
                />
            </div>
        </transition>
    </div>
</template>
<script>
    import Stocks from "@/components/Stocks.vue";
    import Loading from "@/components/Loading.vue";
    import ResetTime from "@/components/ResetTime.vue";
    import { mapActions } from "vuex";

    export default {
        data: () => ({
            alert: {
                show: true,
                color: "secondary",
                message: "blank alert",
                timeout: 1,
            },
            stocks: [],
            secondsToReset: 0,
            loading: true,
        }),
        components: { Stocks, Loading, ResetTime },
        beforeMount() {
            this.refreshStocks();
        },
        methods: {
            ...mapActions(["buy"]),
            buyStock({ stock, quantity }) {
                const endpoint = "/v1/company/" + stock.id + "/buy";
                let formData = new FormData();
                formData.append("amount", quantity);
                const config = {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                };
                this.$http
                    .post(endpoint, formData, config)
                    .then((resp) => {
                        const amount = resp.data.purchase_amount;
                        const price = this.$options.filters.money(
                            resp.data.total_price
                        );
                        const amountWithFilter = this.$options.filters.qtd(
                            amount
                        );
                        this.buy({
                            stock,
                            quantity: amount,
                        });
                        let message = "";
                        if (amount > 1) {
                            message = `Comprado ${amountWithFilter} ações de ${stock.name}, pelo valor ${price}, com sucesso!`;
                        } else {
                            message = `Comprado ${amountWithFilter} ação de ${stock.name}, pelo valor ${price}, com sucesso!`;
                        }
                        this.alert = {
                            show: true,
                            color: "success",
                            message,
                            timeout: 5000,
                        };
                    })
                    .catch((error) => {
                        const resp = error.response;
                        const data = resp.data;
                        switch (resp.status) {
                            case 400:
                                switch (data.error) {
                                    case "invalid amount":
                                        this.alert = {
                                            show: true,
                                            color: "error",
                                            message: "Quantidade inválida!",
                                            timeout: 5000,
                                        };
                                        break;

                                    case "you don't have enough money":
                                        this.alert = {
                                            show: true,
                                            color: "error",
                                            message:
                                                "Você não possui dinheiro suficiente!",
                                            timeout: 5000,
                                        };
                                        break;

                                    default:
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
                                            resp
                                        );
                                        break;
                                }
                                break;

                            case 404:
                                this.alert = {
                                    show: true,
                                    color: "error",
                                    message: "Empresa não encontrada!",
                                    timeout: 5000,
                                };
                                break;

                            default:
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
                                    error
                                );
                                break;
                        }
                    });
            },
            refreshStocks() {
                this.loading = true;
                this.$http
                    .get("/v1/company")
                    .then((resp) => {
                        this.stocks = resp.data;
                        this.$http
                            .get("/v1/company/next/change")
                            .then((resp) => {
                                this.secondsToReset = resp.data.seconds;
                                this.loading = false;
                            })
                            .catch((error) => {
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
                                    error
                                );
                            });
                    })
                    .catch((error) => {
                        this.alert = {
                            show: true,
                            color: "error",
                            message:
                                "Ops, ocorreu um erro inesperado, por favor, reporte este erro para o desenvolvedor.",
                            timeout: -1,
                        };
                        console.log("Erro inesperado");
                        console.log("For favor, reporte este erro: ", error);
                    });
            },
        },
    };
</script>
