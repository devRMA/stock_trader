<template>
    <div>
        <h1>Entre com sua conta</h1>
        <v-container>
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
            <v-form ref="form" v-model="formValid">
                <v-text-field
                    outlined
                    shaped
                    v-model="email"
                    :rules="emailRules"
                    :error-messages="emailErrorMessages"
                    :counter="255"
                    label="E-mail"
                    placeholder="joaozinho@email.com.br"
                    hint="E-mail que foi usado para criar a conta"
                    required
                    :error="emailError"
                    @keydown="changedEmail"
                ></v-text-field>
                <v-text-field
                    outlined
                    shaped
                    v-model="password"
                    :rules="passwordRules"
                    :error-messages="passwordErrorMessages"
                    label="Senha"
                    placeholder="******"
                    hint="A senha que você irá usar para fazer o login"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    required
                    @keydown="changedPassword"
                    @click:append="showPassword = !showPassword"
                ></v-text-field>
                <v-btn
                    :disabled="!formValid"
                    color="info"
                    :loading="processing"
                    @click="login"
                >
                    Login
                </v-btn>
            </v-form>
        </v-container>
    </div>
</template>
<script>
    import { mapActions } from "vuex";
    import { mapGetters } from "vuex";
    export default {
        data: () => ({
            processing: false,
            alert: {
                show: false,
                color: "secondary",
                message: "blank alert",
                timeout: -1,
            },
            formValid: false,
            email: "",
            emailError: false,
            emailErrorMessages: [],
            emailRules: [
                (v) => !!v || "Você precisa informar o e-mail!",
                (v) => v.length <= 255 || "O e-mail deve ter até 255 carácteres!",
            ],
            password: "",
            passwordError: false,
            passwordErrorMessages: [],
            passwordRules: [
                (v) => !!v || "Você precisa informar a senha!",
                (v) => v.length >= 4 || "A senha deve ter no mínimo 4 digitos!",
            ],
            showPassword: false,
        }),
        methods: {
            ...mapActions(["loginAction"]),
            changedEmail() {
                if (this.emailError) {
                    this.emailError = false;
                    this.emailErrorMessages.pop();
                }
            },
            changedPassword() {
                if (this.passwordError) {
                    this.passwordError = false;
                    this.passwordErrorMessages.pop();
                }
            },
            login() {
                this.$refs.form.validate();
                if (this.formValid) {
                    this.processing = true;
                    let formData = new FormData();
                    formData.append("email", this.email);
                    formData.append("password", this.password);
                    let endpoint = "/auth/login";
                    let config = {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    };
                    this.$http
                        .post(endpoint, formData, config)
                        .then((resp) => {
                            this.$cookies.set(
                                "token",
                                resp.data.access_token,
                                resp.data.expires_in,
                                null,
                                null,
                                true
                            );
                            endpoint = "/profile/@me";
                            this.$http
                                .get(endpoint)
                                .then((resp) => {
                                    this.loginAction(resp.data);
                                    this.$router.push({ name: "Home" });
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
                            const resp = error.response;
                            const data = resp.data;
                            switch (resp.status) {
                                case 403:
                                    if (
                                        data.error ==
                                        "e-mail or password is invalid."
                                    ) {
                                        this.alert = {
                                            show: true,
                                            color: "error",
                                            message: "E-mail ou senha inválidos",
                                            timeout: 5000,
                                        };
                                    }
                                    break;

                                case 422:
                                    if (
                                        data.message ==
                                        "The given data was invalid."
                                    ) {
                                        Object.keys(data.errors).forEach((el) => {
                                            const msgErro = data.errors[el][0];
                                            this[`${el}Error`] = true;
                                            switch (msgErro) {
                                                case `The ${el} field is required.`:
                                                    this[`${el}ErrorMessages`].push(
                                                        "Você precisa informar este campo!"
                                                    );
                                                    break;

                                                default:
                                                    this[`${el}Error`] = false;
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
                                                        msgErro
                                                    );
                                                    break;
                                            }
                                        });
                                    }
                                    break;

                                case 500:
                                    this.alert = {
                                        show: true,
                                        color: "error",
                                        message:
                                            "Ops, ocorreu um erro interno no servidor, tente novamente.",
                                        timeout: 2000,
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
                                    console.log("Erro (status) inesperado");
                                    console.log(
                                        "For favor, reporte este status: ",
                                        resp.status
                                    );
                                    break;
                            }
                            this.processing = false;
                        });
                }
            },
        },
        mounted() {
            if (this.tokenExpired) {
                this.alert = {
                    show: true,
                    color: "error",
                    message: "Sessão expirada, faça login novamente",
                    timeout: -1,
                };
            } else if (this.registered) {
                this.alert = {
                    show: true,
                    color: "success",
                    message:
                        "Conta criada com sucesso! Faça o login com o e-mail e senha cadastrados!",
                    timeout: -1,
                };
            }
        },
        computed: {
            ...mapGetters(["tokenExpired", "registered"]),
        },
    };
</script>
