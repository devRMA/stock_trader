<?php

namespace App\Http\Controllers;

use App\Models\User;
use F9Web\ApiResponseHelpers;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

/**
 * @group Profile
 *
 * User profile endpoints
 *
 * @authenticated
 */
class ProfileController extends Controller
{
    use ApiResponseHelpers;

    /**
     * Me
     *
     * Get the details from logged user.
     *
     * @responseField id integer The id of user.
     * @responseField name string The name of user.
     * @responseField email string The email of user.
     * @responseField money integer The money of user.
     * @responseField actions object[] The actions of user.
     * @responseField created_at string When the account was created
     * (format: 'day-month-year').
     * @responseField actions_value integer The money the user has, in actions.
     *
     * @response 401 scenario="Invalid Token" {"message": "..."}
     * @response 200 scenario="success" {
     *     "id": 1,
     *     "name": "Test",
     *     "email": "test@email.com",
     *     "money": 1000,
     *     "actions": [],
     *     "created_at": "18-09-2021",
     *     "actions_value": 0
     * }
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(): JsonResponse
    {
        $loggedUser = Auth::user();
        $loggedUser = User::with(['actions.company'])
            ->where('id', $loggedUser->id)
            ->first();
        $userArray               = $loggedUser->toArray();
        $userArray['created_at'] = $loggedUser->created_at->format('d-m-Y');
        $actions_value           = 0;
        foreach ($loggedUser->actions as $action) {
            $actions_value += $action->quantity * $action->price_purchased;
        }
        $userArray['actions_value'] = $actions_value;
        return $this->respondWithSuccess($userArray);
    }

    /**
     * Destroy
     *
     * Destroy account and all game data from logged user.
     *
     * @responseField success boolean If successful deleting account.
     *
     * @response 401 scenario="Invalid Token" {"message": "..."}
     * @response 500 scenario="There was an error deleting the user." {
     *     "success": false,
     *     "error": "failed to delete user"
     * }
     * @response 200 scenario="success" {
     *     "success": true
     * }
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyAccount(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        foreach ($user->actions as $action) {
            $action->delete();
        }
        if ($user->delete()) {
            /** @var \Tymon\JWTAuth\JWTGuard $guard */
            $guard = Auth::guard();
            $guard->invalidate();
            return $this->respondWithSuccess();
        } else {
            return response()->json([
                'success' => false,
                'error'   => 'failed to delete user',
            ]);
        }
    }
}
