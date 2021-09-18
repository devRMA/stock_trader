<?php

use App\Http\Controllers\ActionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RankController;
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

Route::get('/', function () {
    return response('nothing', 200);
});

Route::get('/ping', function () {
    return response('pong', 200);
});

Route::prefix('auth')->group(function () {
    Route::post('register', [
        AuthController::class,
        'register',
    ]);
    Route::post('login', [
        AuthController::class,
        'login',
    ]);
    Route::post('refresh', [
        AuthController::class,
        'refresh',
    ]);
    Route::middleware('jwt.auth')->group(function () {
        Route::post('logout', [
            AuthController::class,
            'logout',
        ]);
    });
});

Route::prefix('profile')->middleware('jwt.auth')->group(function () {
    Route::get('@me', [
        ProfileController::class,
        'me',
    ]);
    Route::delete('@me', [
        ProfileController::class,
        'destroyAccount',
    ]);
});

Route::prefix('v1')->group(function () {
    Route::get('/', function () {
        return response('nothing', 200);
    });
    Route::middleware('jwt.auth')->group(function () {
        Route::prefix('company')->group(function () {
            Route::get('/', [
                CompanyController::class,
                'getAll',
            ]);
            Route::get('/next/change', [
                CompanyController::class,
                'getNextPriceChange',
            ]);
            Route::post('/{id}/buy', [
                CompanyController::class,
                'buy',
            ])->where('id', '[0-9]+');
            Route::post('/{id}/sell', [
                CompanyController::class,
                'sell',
            ])->where('id', '[0-9]+');
        });
        Route::prefix('actions')->group(function () {
            Route::get('/', [
                ActionController::class,
                'getAll',
            ]);
        });
        Route::get('/rank', [
            RankController::class,
            'getRank',
        ]);
    });
});
