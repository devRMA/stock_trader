<template>
    <v-app id="inspire">
        <v-app-bar app>
            <v-toolbar-title>
                Projeto 3 (StockTrader) Back-end
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="text-uppercase">
                <v-btn text :href="docsLink">docs</v-btn>
            </v-toolbar-items>
        </v-app-bar>

        <v-main class="text-center">
            <slot></slot>
        </v-main>
    </v-app>
</template>

<script>
    export default {
        props: {
            docsLink: {
                type: String,
                required: true,
            },
        },
    };
</script>
