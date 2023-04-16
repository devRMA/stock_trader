<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (request()->wantsJson()) {
        return response()->json('API Stock Trader');
    }

    return redirect()->away(config('urls.frontend.index'));
});
