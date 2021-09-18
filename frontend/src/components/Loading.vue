<template>
    <v-card
        :style="{
            width,
            height,
        }"
    >
        <v-progress-linear :color="color" indeterminate></v-progress-linear>
        <v-card-title class="d-flex justify-center my-6">
            <h2>{{ text }}</h2>
        </v-card-title>
        <v-card-text class="d-flex justify-center">
            <v-progress-circular
                :size="size"
                :color="color"
                indeterminate
                class="mt-6"
            ></v-progress-circular>
        </v-card-text>
    </v-card>
</template>
<script>
    export default {
        props: {
            width: {
                type: String,
                default: "50%",
            },
            height: {
                type: String,
                default: "50%",
            },
            size: {
                type: Number,
                default: 200,
            },
            color: {
                type: String,
                default: "info",
            },
            text: {
                type: String,
                default: "Loading",
            },
        },
    };
</script>