<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\OAuthController;
use App\Http\Controllers\UsersController;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

// GET /
Route::get('/', function () {
    return response()->json('Stock Trader API v2');
});

Route::controller(OAuthController::class)
    ->name('oauth.')
    ->prefix('auth')
    ->group(function () {
        Route::name('github.')
            ->prefix('github')
            ->group(function () {
                // GET auth/github
                Route::get('', 'githubProvider')
                    ->name('provider');

                // GET auth/github/callback
                Route::get('callback', 'githubCallback')
                    ->name('callback');
            });

        Route::name('discord.')
            ->prefix('discord')
            ->group(function () {
                // GET auth/discord
                Route::get('', 'discordProvider')
                    ->name('provider');

                // GET auth/discord/callback
                Route::get('callback', 'discordCallback')
                    ->name('callback');
            });
    });

Route::controller(UsersController::class)
    ->name('users.')
    ->prefix('users')
    ->group(function () {
        Route::name('me.')
            ->prefix('@me')
            ->group(function () {
                // GET users/@me
                Route::get('', function () {
                    /** @var \App\Models\User */
                    $user = auth()->user();
                    $user->showPrivatesAttributes();

                    return response()->json(new UserResource($user));
                })
                    ->middleware('auth:sanctum')
                    ->name('index');

                // POST users/@me/avatar
                Route::post('avatar', 'setAvatar')
                    ->name('set_avatar');
            });

        // GET users/
        Route::get('/', 'index')
            ->name('index');

        // GET users/{user}
        Route::get('{user}', 'show')
            ->where('user', '[0-9]+')
            ->name('show');

        // PUT users/{user}
        Route::put('{user}', 'update')
            ->where('user', '[0-9]+')
            ->name('update');

        // DELETE users/{user}
        Route::delete('{user}', 'destroy')
            ->where('user', '[0-9]+')
            ->name('destroy');

        Route::name('bans.')
            ->prefix('bans')
            ->group(function () {
                // POST users/bans/{user}
                Route::post('{user}', 'ban')
                    ->where('user', '[0-9]+')
                    ->name('add');

                // DELETE ers/bans/{user}
                Route::delete('{user}', 'unban')
                    ->where('user', '[0-9]+')
                    ->name('remove');
            });
    });

Route::controller(CompanyController::class)
    ->name('companies.')
    ->prefix('companies')
    ->group(function () {
        // GET companies/
        Route::get('/', 'index')
            ->name('index');

        // GET companies/update-in
        Route::get('update-in', 'updateIn')
            ->name('update_in');

        // POST companies/{company}
        Route::post('{company}', 'buyActions')
            ->where('company', '[0-9]+')
            ->name('buy_actions');

        // PUT companies/{company}
        Route::put('{company}', 'sellActions')
            ->where('company', '[0-9]+')
            ->name('sell_actions');

        // GET companies/@me
        Route::get('@me', 'myCompanies')
            ->name('my_companies');
    });
