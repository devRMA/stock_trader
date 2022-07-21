<?php

namespace App\Http\Controllers;

use App\Http\Requests\BuyCompanyRequest;
use App\Http\Resources\CompanyCollection;
use App\Models\Company;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class CompanyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->only('myCompanies');
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
                Cache::remember(
                    'companies' . request()->get('page', 1),
                    120,
                    fn() => Company::orderBy('name')->fastPaginate()
                )
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
        return response()
            ->json('', Response::HTTP_NOT_IMPLEMENTED);
    }
}
