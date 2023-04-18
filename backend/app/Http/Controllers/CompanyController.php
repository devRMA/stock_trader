<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\JsonResponse;

class CompanyController extends Controller
{
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

        return response()
            ->json(new CompanyResource($company), JsonResponse::HTTP_CREATED);
    }
}
