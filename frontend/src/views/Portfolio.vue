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
            <div class="actions" key="actions" v-else>
                <Actions :actions="actions" @sellAction="sellAction" />
                <ResetTime
                    :secondsToReset="secondsToReset"
                    @end="refreshAction"
                />
            </div>
        </transition>
    </div>
</template>
<script>
    import Actions from "@/components/Actions.vue";
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
            actions: [],
            secondsToReset: 0,
            loading: true,
        }),
        components: { Actions, Loading, ResetTime },
        beforeMount() {
            this.refreshAction();
        },
        methods: {
            ...mapActions(["sell"]),
            refreshAction() {
                this.loading = true;
                this.$http
                    .get("/v1/company/next/change")
                    .then((resp) => {
                        this.secondsToReset = resp.data.seconds;
                        this.$http
                            .get("/v1/actions")
                            .then((resp) => {
                                this.actions = resp.data;
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
            sellAction({ action, quantity }) {
                const company = action.company;
                const endpoint = "/v1/company/" + company.id + "/sell";
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
                        const amount = resp.data.sold_amount;
                        const price = this.$options.filters.money(
                            resp.data.sold_price
                        );
                        const amountWithFilter = this.$options.filters.qtd(
                            amount
                        );
                        this.sell({
                            company,
                            quantity: amount,
                        });
                        this.refreshAction();
                        let message = "";
                        if (amount > 1) {
                            message = `Vendido ${amountWithFilter} ações de ${company.name}, pelo valor ${price}, com sucesso!`;
                        } else {
                            message = `Vendido ${amountWithFilter} ação de ${company.name}, pelo valor ${price}, com sucesso!`;
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

                                    case "you don't have enough stock":
                                        this.alert = {
                                            show: true,
                                            color: "error",
                                            message:
                                                "Você não possui essas ações para vender!",
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
        },
    };
</script>
