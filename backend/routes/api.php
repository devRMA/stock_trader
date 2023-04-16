<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (request()->wantsJson()) {
        return response()->json(config('app.name'));
    }

    return redirect()->away(config('urls.frontend.index'));
});
