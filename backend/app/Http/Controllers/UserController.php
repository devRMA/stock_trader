<?php

namespace App\Http\Controllers;

use App\Http\Resources\CompanyResource;
use App\Http\Resources\PrivateUserResource;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Returns the information of the currently logged in user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(): JsonResponse
    {
        /** @var \App\Models\User */
        $user = auth()->user();

        return response()
            ->json(new PrivateUserResource($user));
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
