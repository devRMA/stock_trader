<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Str;

class AcceptLanguage
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\Response
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->headers->has('Accept-Language')) {
            $locale = $request->headers->get('Accept-Language') ?? 'en';
            $locale = Str::snake(Str::lower($locale));
            App::setLocale($locale);
            Lang::setLocale($locale);
        }

        return $next($request);
    }
}
