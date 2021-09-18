<template>
    <v-flex class="pr-3 pb-3" xs12 md6 lg4>
        <v-card class="blue darken-3 white--text">
            <v-card-title class="headline">
                <strong class="text-capitalize">
                    {{ action.company.name }}
                </strong>
            </v-card-title>
            <v-card-text class="white--text">
                Preço de venda: {{ action.company.price | money }}
                <br />
                Preço quando comprado: {{ action.price_purchased | money }}
                <br />
                Quantidade: {{ action.quantity | qtd }}
            </v-card-text>
        </v-card>
        <v-card>
            <v-container fill-height>
                <v-text-field
                    label="Quantidade"
                    type="number"
                    v-model.number="quantity"
                    :error="textError"
                />
            </v-container>
            <v-card-actions>
                <v-btn
                    class="green darken-3 white--text ml-3"
                    :disabled="!canSell"
                    :loading="loading"
                    @click="sellAction(quantity)"
                >
                    Vender
                </v-btn>
                <v-btn
                    class="green darken-3 white--text ml-3"
                    :loading="loading"
                    @click="sellAction('all')"
                >
                    Vender Tudo
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-flex>
</template>
<script>
    import { mapGetters } from "vuex";
    export default {
        props: {
            action: {
                type: Object,
                required: true,
            },
        },
        data: () => ({
            quantity: 0,
            loading: false,
        }),
        methods: {
            sellAction(amount) {
                this.loading = true;
                let quantity = this.quantity;
                if (amount == "all") {
                    quantity = "all";
                }
                setTimeout(() => {
                    this.loading = false;
                }, 3000);
                this.$emit("sellAction", {
                    action: this.action,
                    quantity,
                });
            },
        },
        computed: {
            ...mapGetters(["money", "actions"]),
            canSell() {
                const isInt = Number.isInteger(this.quantity);
                const isPositive = this.quantity > 0;
                const hasAction = this.quantity <= this.action.quantity;
                return isPositive && isInt && hasAction;
            },
            textError() {
                const isNotInt = !Number.isInteger(this.quantity);
                const hasNotAction = this.quantity > this.action.quantity;
                const isNegative = this.quantity < 0;
                return isNotInt || hasNotAction || isNegative;
            },
        },
    };
</script>