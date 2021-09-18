<template>
    <v-layout row wrap>
        <template v-if="actions.length > 0">
            <Action
                v-for="action in actions"
                :key="action.id"
                :action="action"
                @sellAction="$emit('sellAction', $event)"
            />
        </template>
        <template v-else>
            <v-card>
                <v-card-title>
                    <span class="headline">
                        Você não possui ações, vá na aba de ações, e compre
                        ações!
                    </span>
                </v-card-title>
            </v-card>
        </template>
    </v-layout>
</template>
<script>
    import Action from "./Action.vue";
    export default {
        props: {
            actions: {
                type: Array,
                required: true,
            },
        },
        components: { Action },
    };
</script>