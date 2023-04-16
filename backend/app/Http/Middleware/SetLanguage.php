<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class SetLanguage
{
    /**
     * Set the language of the application based on the "Accept-Language" header of the request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return \Illuminate\Http\Request
     */
    public function handle(Request $request, \Closure $next): Response
    {
        $acceptLanguage = $request->header('Accept-Language');

        $locale = $this->parseLocale($acceptLanguage);

        app()->setLocale($locale);

        return $next($request);
    }

    /**
     * Parse the "Accept-Language" header string and return the corresponding language.
     *
     * @param null|string $acceptLanguage
     *
     * @return string
     */
    protected function parseLocale(?string $acceptLanguage): string
    {
        $locale = Str::of($acceptLanguage ?? '')
            ->replace('-', '_')
            ->lower()
            ->snake();

        return $locale->isNotEmpty() ? $locale : 'en';
    }
}
