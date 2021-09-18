<template>
    <v-card>
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
        <v-card-title>
            <span class="headline">Detalhes da sua conta</span>
        </v-card-title>
        <v-card-text>
            <v-text-field
                label="Nome"
                :value="user.name"
                disabled
            ></v-text-field>
            <v-text-field
                label="E-mail"
                :value="user.email"
                disabled
            ></v-text-field>
            <v-text-field
                label="Dinheiro na carteira"
                :value="money | money"
                disabled
            ></v-text-field>
            <v-text-field
                label="Dinheiro em ações"
                :value="user.actions_value | money"
                disabled
            ></v-text-field>
            <v-text-field
                label="Data de criação da conta"
                :value="user.created_at | date"
                disabled
            ></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-dialog v-model="dialog" width="60%">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="error"
                        class="ml-auto mr-3 mb-3"
                        v-bind="attrs"
                        v-on="on"
                    >
                        Excluir conta
                    </v-btn>
                </template>

                <v-card>
                    <v-card-title> Exclusão de conta </v-card-title>

                    <v-card-text>
                        Você tem certeza que deseja excluir sua conta? Apos
                        excluir sua conta, todo o seu progresso sera perdido, e
                        não tem como recuperar.
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="success" @click="dialog = false">
                            Cancelar
                        </v-btn>
                        <v-btn
                            color="error"
                            @click="deleteAccount"
                            :loading="loading"
                        >
                            Deletar conta
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-actions>
    </v-card>
</template>
<script>
    import { mapActions } from "vuex";
    import { mapGetters } from "vuex";
    export default {
        data: () => ({
            dialog: false,
            loading: false,
            alert: {
                show: false,
                color: "secondary",
                message: "blank alert",
                timeout: -1,
            },
        }),
        methods: {
            ...mapActions(["logoutAction"]),
            deleteAccount() {
                this.loading = true;
                this.$http
                    .delete("/profile/@me")
                    .then(() => {
                        this.loading = false;
                        this.logoutAction();
                        this.$router.push({ name: "Home" });
                    })
                    .catch((error) => {
                        const resp = error.response;
                        switch (resp.status) {
                            case 400:
                                this.loading = false;
                                this.alert = {
                                    show: true,
                                    color: "error",
                                    message:
                                        "Erro ao excluir a conta, tente novamente",
                                    timeout: 5000,
                                };
                                break;

                            case 500:
                                this.alert = {
                                    show: true,
                                    color: "error",
                                    message:
                                        "Ops, ocorreu um erro interno no servidor, tente novamente.",
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
                                console.log("For favor, reporte este erro: ", resp);
                                break;
                        }
                    });
            },
        },
        computed: {
            ...mapGetters(["user", "money"]),
        },
        filters: {
            date(value) {
                const day = value.split("-")[0];
                const month = value.split("-")[1];
                const year = value.split("-")[2];
                return `${day}/${month}/${year}`;
            },
        },
    };
</script>