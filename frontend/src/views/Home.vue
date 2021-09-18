<template>
    <v-container>
        <v-row class="text-center">
            <v-col cols="12">
                <h2 class="display-2 font-weight-bold mb-3">
                    Bem-vindo ao projeto
                    <br />
                    StockTrader!
                </h2>
            </v-col>
            <v-col cols="12">
                <v-layout justify-center wrap>
                    <p class="my-6 subheading font-weight-regular text-box">
                        Este projeto foi desenvolvido com o intuito de exercitar
                        os conhecimentos adquiridos durante o
                        <a
                            href="https://www.udemy.com/course/vue-js-completo/"
                            target="_blank"
                        >
                            curso de Vue.js</a
                        >
                        e o
                        <a
                            href="https://www.udemy.com/course/curso-completo-do-desenvolvedor-laravel/"
                            target="_blank"
                        >
                            curso de laravel</a
                        >. O projeto foi desenvolvido utilizando o
                        <a href="https://vuejs.org/" target="_blank">
                            Vue.js
                        </a>
                        e o
                        <a href="https://vuetifyjs.com/" target="_blank">
                            Vuetify
                        </a>
                        no front, e
                        <a href="https://laravel.com/" target="_blank"
                            >Laravel</a
                        >
                        na API.
                        <br />
                        Projeto feito por
                        <a href="https://github.com/devRMA" target="_blank">
                            devRMA
                        </a>
                    </p>
                </v-layout>
            </v-col>
            <v-col>
                <v-layout justify-center wrap>
                    <p class="subheading font-weight-regular text-box">
                        Assim que você cria uma conta, você começa com 1.000
                        cristianos ronaldos e você pode utilizar este saldo para
                        comprar ações. De tempo em tempo, o valor das ações muda
                        aleatoriamente, quando a ação estiver por um preço maior
                        do que você comprou, você pode vender a sua ação e
                        lucrar.
                    </p>
                </v-layout>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>
    .text-box {
        max-width: 40%;
    }
</style>