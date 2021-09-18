<template>
    <div>
        <h1>Crie sua conta</h1>
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
                    v-model="name"
                    :rules="nameRules"
                    :error-messages="nameErrorMessages"
                    :counter="255"
                    label="Nome"
                    placeholder="John Doe"
                    hint="Este nome que irá aparecer no rank"
                    required
                    @keydown="changedName"
                ></v-text-field>
                <v-text-field
                    outlined
                    shaped
                    v-model="email"
                    :rules="emailRules"
                    :error-messages="emailErrorMessages"
                    :counter="255"
                    label="E-mail"
                    placeholder="joaozinho@email.com.br"
                    hint="Não precisa ser um e-mail real, você só irá usar para fazer o login"
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
                    @click="register"
                    :loading="processing"
                >
                    Cadastrar
                </v-btn>
            </v-form>

            <v-alert
                border="left"
                dense
                elevation="10"
                prominent
                text
                type="success"
                class="mt-6"
            >
                Você pode excluir a sua conta com todos os dados salvos, a
                qualquer momento.
            </v-alert>
        </v-container>
    </div>
</template>
<script>
    import { mapActions } from "vuex";
    export default {
        data: () => ({
            formValid: false,
            processing: false,
            alert: {
                show: false,
                color: "secondary",
                message: "blank alert",
                timeout: -1,
            },
            name: "",
            nameError: false,
            nameErrorMessages: [],
            nameRules: [
                (v) => !!v || "Você precisa informar o nome!",
                (v) => v.length >= 4 || "A senha deve ter no mínimo 4 digitos!",
                (v) => v.length <= 255 || "O nome deve ter até 255 carácteres!",
            ],
            email: "",
            emailError: false,
            emailErrorMessages: [],
            emailRules: [
                (v) => !!v || "Você precisa informar o e-mail!",
                (v) => /\S+@\S+\.\S+/.test(v) || "E-mail inválido!",
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
            ...mapActions(["registered"]),
            changedName() {
                if (this.nameError) {
                    this.nameError = false;
                    this.nameErrorMessages.pop();
                }
            },
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
            register() {
                this.$refs.form.validate();
                if (this.formValid) {
                    this.processing = true;
                    let formData = new FormData();
                    formData.append("name", this.name);
                    formData.append("email", this.email);
                    formData.append("password", this.password);
                    let endpoint = "/auth/register";
                    let config = {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    };
                    this.$http
                        .post(endpoint, formData, config)
                        .then(() => {
                            this.processing = false;
                            this.registered();
                            this.$router.push({ name: "Login" });
                        })
                        .catch((error) => {
                            const resp = error.response;
                            const data = resp.data;
                            this.alert = {
                                show: true,
                                color: "error",
                                message: "Erro ao criar conta",
                                timeout: 5000,
                            };
                            switch (resp.status) {
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

                                                case `The ${el} must be at least 4 characters.`:
                                                    this[`${el}ErrorMessages`].push(
                                                        "Este campo precisa ter pelo menos 4 digitos!"
                                                    );
                                                    break;

                                                case `The ${el} must not be greater than 255 characters.`:
                                                    this[`${el}ErrorMessages`].push(
                                                        "Este campo deve ter até 255 carácteres!"
                                                    );
                                                    break;

                                                case `The ${el} must be a valid email address.`:
                                                    this[`${el}ErrorMessages`].push(
                                                        "Este campo deve ser um e-mail válido!"
                                                    );
                                                    break;

                                                case "The email has already been taken.":
                                                    this["emailErrorMessages"].push(
                                                        "Este e-mail já foi cadastrado!"
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
                                            data
                                        );
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
    };
</script>