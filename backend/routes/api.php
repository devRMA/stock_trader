<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (request()->wantsJson()) {
        return response()->json(config('app.name'));
    }

    return redirect()->away(config('urls.frontend.index'));
});

Route::controller(UserController::class)
    ->name('users.')
    ->prefix('users')
    ->group(function () {
        Route::name('@me.')
            ->prefix('@me')
            ->middleware('auth')
            ->group(function () {
                // GET users/@me
                Route::get('', 'me')
                    ->name('index');
            });
    });
