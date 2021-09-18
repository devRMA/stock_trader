<h1 align="center">
    Projeto Stock Trader
</h1>

Este projeto foi desenvolvido com os conhecimentos obtidos no curso de [vue.js](https://www.udemy.com/course/vue-js-completo/) e [laravel](https://www.udemy.com/course/curso-completo-do-desenvolvedor-laravel/).

Api feita com laravel, e está rodando em [heroku](https://www.heroku.com/). Você pode ler a documentação da API [aqui](https://api-projeto-3.herokuapp.com/docs/).
O frontend, está rodando em [vercel](https://vercel.com/). Você pode acessar o site [aqui](https://stocktrader-bay.vercel.app/).

## Tecnologias usadas

### **Frontend**

- [Vue.js](https://vuejs.org/)
- [Vuex](https://vuex.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/docs/intro)
- [Vue Cookies](https://www.npmjs.com/package/vue-cookies)
- [Vuetify](https://vuetifyjs.com/)

### **Backend**

- [Laravel](https://laravel.com/)
- [Laravel API Response Helpers](https://github.com/f9webltd/laravel-api-response-helpers)
- [Jwt-Auth](https://github.com/tymondesigns/jwt-auth)
- [Scribe](https://scribe.knuckles.wtf/)

## Requisitos para rodar o projeto em localhost

- [PHP](https://php.net/) na versão 7.4.21 ou superior.
- [Composer](https://getcomposer.org/).
- [Postgresql](https://www.postgresql.org/) você até pode tentar usar outro banco relacional, mas não garanto que o rank irá funcionar.
- [Node.js](https://nodejs.org/en/) na versão 14.17.4 ou superior.
- [Yarn](https://yarnpkg.com/) ou o npm.

## Passo a passo para rodar em localhost

1. Vá na pasta do backend e instale as dependencias do php.
  ``composer install``

2. Instale as dependencias do node.
   ``yarn install`` ou ``npm install``

3. Crie o arquivo *.env* e copie o conteúdo do arquivo `.env.example`
4. Gere as chaves (caso pergunte se você deseja sobrescrever, digite `yes`).
   ``php artisan key:generate``
   ``php artisan jwt:secret``
5. Vá ao arquivo `.env` e coloque as credenciais do seu banco de dados.
6. Vá ao seu banco de dados relacional, e crie o banco `stock-trader`.
7. Execute as migrations já populando a tabela de empresas.
   ``php artisan migrate --seed``
8. Compile os assets.
   ``yarn prod`` ou ``npm run prod``
   (caso de o erro `'mix' não é reconhecido como um comando interno` use o comando `yarn add laravel-mix` e tente compilar de novo)
9. Inicie a api.
    ``php artisan serve``
10. Agora, entre na pasta do frontend, e instale as dependencias do node. (passo 2)
11. Entre em [axios](/frontend/src/plugins/axios.js) e coloque onde a api está rodando. Caso a api esteja na porta 8000, não precisa mudar.
12. Inicie o front.
    ``yarn serve`` ou ``npm run serve``
