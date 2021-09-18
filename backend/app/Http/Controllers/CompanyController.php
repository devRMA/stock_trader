<?php

namespace App\Http\Controllers;

use App\Models\Action;
use App\Models\Company;
use Carbon\Carbon;
use F9Web\ApiResponseHelpers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @group Company
 *
 * Company endpoints
 *
 * @authenticated
 */
class CompanyController extends Controller
{
    use ApiResponseHelpers;

    public function __construct()
    {
        // every time any method of this controller is called it will
        // check company prices
        $this->updateCompanyPrice();
    }

    /**
     * Get all
     *
     * Get all companies with prices.
     *
     * @responseField object[].id integer The id of company.
     * @responseField object[].name string The name of company.
     * @responseField object[].price integer The price of company.
     *
     * @response 401 scenario="Invalid Token" {"message": "..."}
     * @response 200 scenario="Success" [
     *     {
     *         "id": 1,
     *         "name": "google",
     *         "price": 500
     *     }
     *]
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAll(): JsonResponse
    {
        /** @var Illuminate\Database\Eloquent\Collection $companies */
        $companies = Company::all();
        return $this->respondWithSuccess($companies->toArray());
    }

    /**
     * Next price change
     *
     * Get when the price of companies will change.
     *
     * @responseField next_price_change string The datetime when the price of companies will change. (deprecated)
     * @responseField seconds integer The The seconds left, for the prices of companies, change.
     *
     * @response 401 scenario="Invalid Token" {"message": "..."}
     * @response 200 scenario="success" {
     *     "next_price_change": "2021-09-18T13:45:19.000000Z",
     *     "seconds": 70
     * }
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNextPriceChange(): JsonResponse
    {
        $company           = Company::first();
        $next_price_change = $this->getCompanyNextUpdateTime($company);
        return $this->respondWithSuccess([
            'next_price_change' => $next_price_change,
            'seconds'           => $next_price_change->diffInSeconds(now()),
        ]);
    }

    /**
     * Buy
     *
     * Buy actions from a company.
     *
     * <aside class="notice">You can pass the "amount" field as "all" to
     * buy all the actions you can.</aside>
     *
     * @urlParam id integer required The ID of company.
     *
     * @bodyParam amount string required The amount of actions to buy.
     *
     * @responseField purchase_amount integer How many actions were purchased.
     * @responseField total_price integer For how much the actions were purchased.
     *
     * @response 404 scenario="Company not found" {"error": "company not found"}
     * @response 401 scenario="Invalid Token" {"message": "..."}
     * @response 400 scenario="Invalid amount" {"error": "invalid amount"}
     * @response 400 scenario="Don't have money" {
     *     "error": "you don't have enough money"
     * }
     * @response 200 scenario="Success" {
     *     "purchase_amount": 1,
     *     "total_price": 500
     * }
     *
     * @param Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function buy(Request $request, int $id): JsonResponse
    {
        $company = Company::find($id);
        if (!$company) {
            return $this->respondNotFound('company not found');
        }
        $amount = $request->get('amount', 0);
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($amount == "all") {
            $amount = intval(floor($user->money / $company->price));
        }
        if ($amount > 0) {
            $total_price = $amount * $company->price;
            if ($user->money >= $total_price) {
                $user->money -= $total_price;
                $user->save();
                $actions = $user->actions->filter(function ($action, $key) use ($company) {
                    if ($action->company_id == $company->id) {
                        return true;
                    }
                });
                // if the user already owns stocks of this company
                if ($actions->count() > 0) {
                    $action = $actions->first();
                    $action->quantity += $amount;
                    if ($action->price_purchased > $company->price) {
                        $action->price_purchased = $company->price;
                    }
                    $action->save();
                } else {
                    Action::create([
                        'user_id'         => $user->id,
                        'company_id'      => $company->id,
                        'price_purchased' => $company->price,
                        'quantity'        => $amount,
                    ]);
                }
                return $this->respondWithSuccess([
                    'purchase_amount' => $amount,
                    'total_price'     => $total_price,
                ]);
            } else {
                return $this->respondError("you don't have enough money");
            }
        } else {
            return $this->respondError('invalid amount');
        }
    }

    /**
     * Sell
     *
     * Sell actions from a company.
     *
     * <aside class="notice">You can pass the "amount" field as "all" to
     * sell all the actions you can.</aside>
     *
     * @urlParam id integer required The ID of company.
     *
     * @bodyParam amount string required The amount of actions to sell.
     *
     * @responseField sold_stocks integer How many actions were sold.
     * @responseField buy_price integer For how much the actions were purchased.
     * @responseField sold_price integer For how much the actions were sold.
     *
     * @response 404 scenario="Company not found" {"error": "company not found"}
     * @response 401 scenario="Invalid Token" {"message": "..."}
     * @response 400 scenario="Invalid amount" {"error": "invalid amount"}
     * @response 400 scenario="Don't have stock" {
     *     "error": "you don't have enough stock"
     * }
     * @response 200 scenario="Success" {
     *     "sold_stocks": 1,
     *     "buy_price": 500
     *     "sold_price": 500
     * }
     *
     * @param Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function sell(Request $request, int $id): JsonResponse
    {
        $company = Company::find($id);
        if (!$company) {
            return $this->respondNotFound('company not found');
        }
        $amount = $request->input('amount', 0);
        /** @var \App\Models\User $user */
        $user   = Auth::user();
        $action = $user->actions
            ->where('company_id', $company->id)
            ->sortBy('price_purchased')
            ->first();
        if ($action) {
            if ($amount == "all") {
                $amount = optional($action)->quantity;
            }
            if ($amount > 0) {
                if ($amount <= optional($action)->quantity) {
                    $sold_stocks = $amount;
                    $buy_price   = $action->price_purchased;
                    $sold_price  = $amount * $company->price;
                    $action->quantity -= $amount;
                    if ($action->quantity == 0) {
                        $action->delete();
                    } else {
                        $action->save();
                    }
                    $user->money += $sold_price;
                    $user->save();
                    return $this->respondWithSuccess([
                        'sold_stocks' => $sold_stocks,
                        'buy_price'   => $buy_price,
                        'sold_price'  => $sold_price,
                    ]);
                } else {
                    return $this->respondError("you don't have enough stock");
                }
            } else {
                return $this->respondError('invalid amount');
            }
        } else {
            return $this->respondError("you don't have enough stock");
        }
    }

    /**
     * Method that updates the company's share price, if necessary.
     *
     * @return void
     */
    protected function updateCompanyPrice()
    {
        $companies = Company::all();
        $now       = now();
        if ($this->companyPriceNeedsUpdate($companies->first())) {
            foreach ($companies as $company) {
                $random_number = rand(
                    config('game.company_min_price'),
                    config('game.company_max_price')
                );
                $company->price             = $random_number;
                $company->last_price_change = $now;
                $company->save();
            }
        }
    }

    /**
     * Method that will check whether the company's share value should change.
     *
     * @urlParam id integer required The company id.
     * @param Company $company
     * @return bool
     */
    protected function companyPriceNeedsUpdate(Company $company): bool
    {
        return $this->getCompanyNextUpdateTime($company) <= now();
    }

    /**
     * Method that returns the next action update time.
     *
     * @param Company $company
     * @return Carbon
     */
    protected function getCompanyNextUpdateTime(Company $company): Carbon
    {
        $lastUpdate = $company->last_price_change;
        return $lastUpdate
            ->addSeconds(config('game.company_price_timeout'));
    }
}
