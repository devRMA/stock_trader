<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
     */

    'paths'                    => [
        'api/*',
        'api/',
        'api/auth/login',
        'api/auth/logout',
        'api/auth/me',
        'api/auth/refresh',
        'api/auth/register',
        'api/ping',
        'api/profile/@me',
        'api/v1',
        'api/v1/actions',
        'api/v1/company',
        'api/v1/company/next/change',
        'api/v1/company/*/buy',
        'api/v1/company/*/sell',
        'api/v1/rank',
        'sanctum/csrf-cookie',
    ],

    'allowed_methods'          => ['*'],

    'allowed_origins'          => [
        '*',
        'https://stocktrader-bay.vercel.app:*',
        'http://stocktrader-bay.vercel.app:*',
        'http://localhost:*',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers'          => ['*'],

    'exposed_headers'          => [],

    'max_age'                  => 0,

    'supports_credentials'     => true,

];
