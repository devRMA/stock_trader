<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\JsonResponse;

class CompanyController extends Controller
{
    public function __construct() {
        $this->middleware('auth')->only([
            'create',
            'myCompanies',
        ]);
    }

    /**
     * Return all companies that the user created.
     *
     * @param \App\Http\Requests\CreateCompanyRequest $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(CreateCompanyRequest $request): JsonResponse
    {
        /** @var \App\Models\User */
        $user = auth()->user();

        abort_unless(
            $user->money >= config('game.company.price_to_create'),
            JsonResponse::HTTP_PAYMENT_REQUIRED,
            'You do not have enough money to create a company.'
        );

        $company = Company::query()
            ->create([
                'user_id' => $user->id,
                'money_invested' => '0',
                'balance' => '0',
                'ipo' => false,
                'selling_percentage' => 0,
                'share_price' => 0,
                ...$request->validated(),
            ]);

        $user->update([
            'money' => $user->money - config('game.company.price_to_create'),
        ]);

        return response()
            ->json(new CompanyResource($company), JsonResponse::HTTP_CREATED);
    }

    /**
     * Return all companies that the user created.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function myCompanies(): JsonResponse
    {
        /** @var \App\Models\User */
        $user = auth()->user();

        return response()
            ->json(
                CompanyResource::collection($user->companies)
            );
    }
}
