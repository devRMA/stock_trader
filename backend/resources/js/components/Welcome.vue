<template>
    <v-container fluid>
        <h1>Oxi, tá procurando o que aqui?</h1>
        <div class="d-flex justify-center">
            <v-img
                src="https://cdn.discordapp.com/emojis/438833254926254110.png"
                lazy-src="https://cdn.discordapp.com/emojis/438833254926254110.png"
                max-width="150"
                class="rounded"
            >
                <template v-slot:placeholder>
                    <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                    >
                        <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                        ></v-progress-circular>
                    </v-row>
                </template>
            </v-img>
        </div>
    </v-container>
</template>
<script>
    export default {};
</script>
