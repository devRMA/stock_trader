<template>
    <v-navigation-drawer :value="value" @input="$emit('input', $event)" app>
        <v-container fluid>
            <v-list class="ml-3">
                <transition name="slide-y" mode="out-in">
                    <div v-if="!logged" key="noLogin" class="mt-6">
                        <h2>Faça o login para ver o rank</h2>
                    </div>
                    <div v-else class="rank" key="rank">
                        <h2>Top 10 Money</h2>
                        <transition-group name="flip-list" tag="div">
                            <v-list-item
                                v-for="(person, key) in rank"
                                :key="person.name + person.id"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <v-badge
                                            inline
                                            left
                                            :content="key + 1"
                                            :color="getBadgeColor(key + 1)"
                                            style="color: black"
                                        ></v-badge>
                                        {{ person.name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        <span class="text-subtitle-1">
                                            {{ person.money | money }}
                                        </span>
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </transition-group>
                    </div>
                </transition>
            </v-list>
        </v-container>
    </v-navigation-drawer>
</template>
<script>
    import { mapGetters } from "vuex";
    export default {
        name: "RankDrawer",
        props: {
            value: {
                type: Boolean,
                default: true,
            },
        },
        data: () => ({
            rank: [],
            intervalRank: null,
        }),
        methods: {
            getBadgeColor(position) {
                switch (position) {
                    case 1:
                        return "yellow accent-3";

                    case 2:
                        return "grey";

                    case 3:
                        return "orange accent-3";

                    default:
                        return "brown darken-4";
                }
            },
            refreshRank() {
                if (this.logged) {
                    this.$http
                        .get("/v1/rank")
                        .then((resp) => {
                            this.rank = resp.data.rank;
                        })
                        .catch(() => {});
                }
            },
        },
        computed: {
            ...mapGetters(["logged"]),
        },
        created() {
            this.refreshRank();
            this.intervalRank = setInterval(() => {
                this.refreshRank();
            }, 10000);
        },
        beforeDestroy() {
            if (this.intervalRank) {
                clearInterval(this.intervalRank);
            }
        },
        watch: {
            logged(newValue) {
                if (newValue) {
                    this.refreshRank();
                }
            },
        },
    };
</script>
<style>
    .flip-list-move {
        transition: transform 1s;
    }
</style>