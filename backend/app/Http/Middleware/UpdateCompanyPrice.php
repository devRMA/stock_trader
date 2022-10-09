<?php

namespace App\Http\Middleware;

use App\Enums\CompanyRisk;
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
        if (! Cache::has('updated-companies-at')) {
            Cache::put(
                'updated-companies-at',
                now(),
                config('game.company.reset_after')
            );
            Company::all()->each(function (Company $company) {
                // TODO: change price variation algorithm
                switch ($company->risk) {
                    case CompanyRisk::Low:
                        $chanceLoss = 20;
                        break;

                    case CompanyRisk::Medium:
                        $chanceLoss = 50;
                        break;

                    case CompanyRisk::High:
                        $chanceLoss = 80;
                        break;
                }
                if ($company->sell_amount > 0) {
                    $chanceLoss *= $company->sell_amount / 100;
                }
                if ($company->buy_amount > 0) {
                    $chanceLoss *= -$company->buy_amount / 100;
                }

                $price = $company->price;
                $variation = config('game.company.minimum_variation') * ($chanceLoss / 100);
                if (fake()->boolean($chanceLoss)) {
                    $price -= ($price * ($company->sell_amount / 100)) + $variation;
                } else {
                    $price += ($price * ($company->buy_amount / 100)) + $variation;
                }
                $company
                    ->setAttribute('price', (int) $price)
                    ->setAttribute('last_price_update', now())
                    ->setAttribute('sell_amount', 0)
                    ->setAttribute('buy_amount', 0)
                    ->save();
            });

            CompaniesUpdated::dispatch();
        }

        return $next($request);
    }
}
