<?php

namespace App\Http\Controllers;

use App\Http\Requests\BuyCompanyRequest;
use App\Http\Requests\SellCompanyRequest;
use App\Http\Resources\CompanyCollection;
use App\Models\Company;
use Illuminate\Http\Response;

class CompanyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->only(
            'myCompanies',
            'buyActions',
            'sellActions'
        );
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()
            ->json(new CompanyCollection(
                Company::orderBy('name')->fastPaginate()
            ));
    }

    /**
     * Displays the companies that the user owns actions.
     *
     * @return \Illuminate\Http\Response
     */
    public function myCompanies()
    {
        /** @var \App\Models\User */
        $user = auth()->user();

        return response()
            ->json(new CompanyCollection($user->actions()->fastPaginate()));
    }

    /**
     * Buy actions from a company.
     *
     * @param  \App\Http\Requests\BuyCompanyRequest  $request
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function buyActions(BuyCompanyRequest $request, Company $company)
    {
        $availableActions = $company->max_actions - $company->investors->sum('pivot.amount');
        $amount = abs($request->validated('amount'));

        abort_if(
            ($amount > $availableActions) || ($availableActions <= 0),
            Response::HTTP_NOT_ACCEPTABLE,
            __('Company has no more actions available')
        );

        /** @var \App\Models\User */
        $user = auth()->user();
        $totalPrice = $amount * $company->price;

        abort_unless(
            $user->money >= $totalPrice,
            Response::HTTP_I_AM_A_TEAPOT,
            __('You do not have enough money')
        );

        if ($user->money >= $totalPrice) {
            $user->money -= $totalPrice;
            $user->save();
            $action = $user->actions->firstWhere('id', $company->id);
            if ($action) {
                $action->pivot->amount += $amount;
                $action->push();
            } else {
                $user->actions()->attach($company, [
                    'amount' => $amount,
                ]);
            }
            $company->buy_amount += $amount;
            $company->save();
        }

        return response()->json('');
    }

    /**
     * Sell actions from a company.
     *
     * @param  \App\Http\Requests\SellCompanyRequest  $request
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function sellActions(SellCompanyRequest $request, Company $company)
    {
        abort_if(
            $company->investors->doesntContain(auth()->id()),
            Response::HTTP_NOT_ACCEPTABLE,
            __('You do not own actions in this company')
        );

        $amount = abs($request->validated('amount'));
        /** @var \App\Models\User */
        $user = $company->investors->find(auth()->id());

        abort_if(
            $user->pivot->amount < $amount,
            Response::HTTP_NOT_ACCEPTABLE,
            __("You don't have enough stock")
        );

        $user->money += $amount * $company->price;
        $user->pivot->amount -= $amount;
        $user->push();

        $company->sell_amount += $amount;
        $company->save();

        return response()->json('');
    }
}
