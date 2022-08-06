<?php

use App\Http\Controllers\CompanyController;
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

// GET users/@me
Route::get('users/@me', function () {
    /** @var \App\Models\User */
    $user = auth()->user();
    $user->showPrivatesAttributes();

    return response()->json(new UserResource($user));
})->middleware('auth:sanctum')->name('me');

Route::controller(UsersController::class)
    ->name('users.')
    ->prefix('users')
    ->group(function () {
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
