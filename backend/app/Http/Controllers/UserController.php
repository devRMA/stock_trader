<?php

namespace App\Http\Controllers;

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
}
