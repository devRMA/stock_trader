<template>
    <v-flex class="pr-3 pb-3" xs12 md6 lg4>
        <v-card class="green darken-3 white--text">
            <v-card-title class="headline">
                <strong class="text-capitalize">
                    {{ stock.name }}
                    <small>(Preço: {{ stock.price | money }})</small>
                </strong>
            </v-card-title>
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
                    class="green darken-3 white--text"
                    :disabled="!canBuy"
                    :loading="loading"
                    @click="buyStock(quantity)"
                >
                    Comprar
                </v-btn>
                <v-btn
                    class="green darken-4 white--text"
                    :disabled="!canBuyAll"
                    :loading="loading"
                    @click="buyStock('all')"
                >
                    Comprar Tudo
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-flex>
</template>
<script>
    import { mapGetters } from "vuex";
    export default {
        props: {
            stock: {
                type: Object,
                required: true,
            },
        },
        data: () => ({
            quantity: 0,
            loading: false,
        }),
        methods: {
            buyStock(amount) {
                let quantity = this.quantity;
                if (amount == "all") {
                    quantity = "all";
                }
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                }, 1000);
                this.$emit("buyStock", {
                    stock: this.stock,
                    quantity,
                });
                this.quantity = 0;
            },
        },
        computed: {
            ...mapGetters(["money"]),
            canBuy() {
                const isInt = Number.isInteger(this.quantity);
                const isPositive = this.quantity > 0;
                const hasMoney = this.quantity * this.stock.price <= this.money;
                return isPositive && isInt && hasMoney;
            },
            canBuyAll() {
                const hasMoney = this.stock.price <= this.money;
                return hasMoney;
            },
            textError() {
                const isNotInt = !Number.isInteger(this.quantity);
                const hasNotMoney = this.quantity * this.stock.price > this.money;
                const isNegative = this.quantity < 0;
                return isNotInt || hasNotMoney || isNegative;
            },
        },
    };
</script>