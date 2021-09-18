<template>
    <div>
        <RankDrawer v-model="showRank" />
        <v-fab-transition>
            <v-btn
                :key="activeFab.icon"
                :color="activeFab.color"
                fab
                large
                @click="toggleRank"
                class="v-btn-fab"
                elevation="10"
            >
                <v-icon>{{ activeFab.icon }}</v-icon>
            </v-btn>
        </v-fab-transition>
    </div>
</template>
<script>
    import RankDrawer from "@/components/RankDrawer.vue";
    export default {
        data: () => ({
            showRank: true,
        }),
        methods: {
            toggleRank() {
                this.showRank = !this.showRank;
            },
        },
        computed: {
            activeFab() {
                if (this.showRank) {
                    return {
                        icon: "mdi-chevron-left",
                        color: "secondary",
                    };
                } else {
                    return {
                        icon: "mdi-podium-gold",
                        color: "warning",
                    };
                }
            },
        },
        components: { RankDrawer },
    };
</script>
<style scoped>
    .v-btn-fab {
        bottom: 0;
        position: fixed;
        margin-left: 2%;
        margin-bottom: 2%;
    }
</style>