<?php

namespace App\Http\Middleware;

use App\Events\CompaniesUpdated;
use App\Models\Company;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class UpdateCompanyPrice
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        Cache::remember('update-company-prices', config('game.company.reset_after'), function () {
            Company::all()->each(fn (Company $company) => $company
                    ->setAttribute('last_price_update', now())
                    ->setAttribute('sell_amount', 0)
                    ->setAttribute('buy_amount', 0)
                    ->setAttribute('price', random_int(100, 1000))
                    ->save()
            );
            
            CompaniesUpdated::dispatch();

            return null;
        });

        return $next($request);
    }
}
