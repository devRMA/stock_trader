<?php

namespace App\Http\Controllers;

use App\Models\Action;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

/**
 * @group Action
 *
 * User Actions Endpoints
 */
class ActionController extends Controller
{
    /**
     * Get all
     *
     * Returns an array of all actions the user has.
     *
     * @authenticated
     *
     * @responseField object[].id integer The id of the registry.
     * @responseField object[].price_purchased integer The price the action was bought at.
     * @responseField object[].quantity integer The number of actions the user has.
     * @responseField object[].company The company the action is for.
     * @responseField object[].company.id The company id.
     * @responseField object[].company.name The company name.
     * @responseField object[].company.price The company price.
     *
     * @response 401 scenario="Invalid Token" {"message": "..."}
     * @response scenario="success" [
     *     {
     *         "id": 3,
     *         "price_purchased": 500,
     *         "quantity": 15,
     *         "company": {
     *             "id": 1,
     *             "name": "google",
     *             "price": 500
     *         }
     *     },
     *     {
     *         "id": 4,
     *         "price_purchased": 500,
     *         "quantity": 10,
     *         "company": {
     *             "id": 2,
     *             "name": "facebook",
     *             "price": 500
     *         }
     *     }
     * ]
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAll(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user    = Auth::user();
        $actions = Action::with('company')
            ->where('user_id', $user->id)
            ->orderBy('price_purchased')
            ->get();
        return response()->json($actions->toArray());
    }
}
