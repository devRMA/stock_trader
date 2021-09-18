<template>
    <v-snackbar
        :value="true"
        color="blue darken-3"
        bottom
        right
        elevation="10"
        timeout="-1"
        app
    >
        <vue-countdown
            :time="secondsToReset * 1000 + 10000"
            v-slot="{ minutes, seconds }"
            @end="$emit('end')"
        >
            Preço mudando em: {{ minutes }}m {{ seconds }}s.
        </vue-countdown>
    </v-snackbar>
</template>
<script>
    import VueCountdown from "@chenfengyuan/vue-countdown";
    export default {
        components: { VueCountdown },
        props: {
            secondsToReset: {
                type: Number,
                required: true,
            },
        },
    };
</script>