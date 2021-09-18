<template>
    <v-sheet
        height="100%"
        width="100%"
        :color="`grey ${$vuetify.theme.dark ? 'darken-3' : 'lighten-2'}`"
    >
        <v-sheet
            height="90%"
            width="90%"
            class="ma-auto mt-3 rounded"
            elevation="10"
        >
            <v-card style="width: 100%; height: 100%">
                <v-progress-linear
                    color="error"
                    indeterminate
                ></v-progress-linear>
                <v-card-title class="d-flex justify-center my-6">
                    <h2>Por favor aguarde, enquanto o site carrega</h2>
                </v-card-title>
                <v-card-text class="d-flex justify-center">
                    <v-progress-circular
                        :size="250"
                        :color="color"
                        indeterminate
                        class="mt-6"
                    ></v-progress-circular>
                </v-card-text>
            </v-card>
        </v-sheet>
    </v-sheet>
</template>
<script>
    export default {
        data: () => ({
            colors: [
                "red",
                "pink",
                "purple",
                "deep-purple",
                "indigo",
                "blue",
                "light-blue",
                "cyan",
                "teal",
                "green",
                "light-green",
                "lime",
                "yellow",
                "amber",
                "orange",
                "deep-orange",
            ],
            currentColor: 0,
            interval: null,
        }),
        computed: {
            color() {
                return this.colors[this.currentColor % this.colors.length];
            },
        },
        mounted() {
            this.interval = setInterval(() => {
                this.currentColor++;
            }, 500);
        },
        beforeDestroy() {
            clearInterval(this.interval);
        },
    };
</script>