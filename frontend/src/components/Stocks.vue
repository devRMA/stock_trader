<template>
    <v-layout row wrap>
        <Stock
            v-for="stock in stocks"
            :key="stock.id"
            :stock="stock"
            @buyStock="$emit('buyStock', $event)"
        />
    </v-layout>
</template>
<script>
    import Stock from "./Stock.vue";
    export default {
        props: {
            stocks: {
                type: Array,
                required: true,
            },
        },
        components: { Stock },
    };
</script>