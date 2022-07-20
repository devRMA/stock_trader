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
})->middleware('auth')->name('me');

Route::apiResource('users', UsersController::class, [
    'except' => [
        'store',
    ],
]);

Route::controller(CompanyController::class)
    ->name('companies.')
    ->prefix('companies')
    ->group(function () {
        // GET companies/
        Route::get('/', 'index')
            ->name('index');

        // GET companies/@me
        Route::get('@me', 'myCompanies')
            ->name('my_companies');
    });
