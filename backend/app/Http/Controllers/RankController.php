<?php

namespace App\Http\Controllers;

use F9Web\ApiResponseHelpers;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * @group Rank
 *
 * Rank endpoints
 *
 * @authenticated
 */
class RankController extends Controller
{
    use ApiResponseHelpers;

    /**
     * Get Rank
     *
     * Get the 10 players with the most money.
     *
     * @responseField rank object[] The array with the users.
     *
     * @response 401 scenario="Invalid Token" {"message": "..."}
     * @response 200 scenario="success" {
     *    "rank": [
     *        {
     *            "id": 15,
     *            "name": "Fulano",
     *            "money": 2000
     *        },
     *        {
     *            "id": 10,
     *            "name": "Beltrano",
     *            "money": 1999
     *        },
     *    ]
     *}
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRank(): JsonResponse
    {
        $rankWithActions = DB::table('users')
            ->select(DB::raw('
            users.id,
            users.name,
            CAST(
                SUM(actions.price_purchased * actions.quantity + users.money)
                AS bigint
                )
                as money
            '))
            ->rightJoin('actions', 'users.id', '=', 'actions.user_id')
            ->groupBy('users.id')
            ->orderByDesc('money')
            ->take(10)
            ->get();
        $rankWithoutActions = DB::table('users')
            ->select('id', 'name', 'money')
            ->orderByDesc('money')
            ->take(10)
            ->get();
        $mergedRank = $rankWithActions
            ->merge($rankWithoutActions)
            ->unique('id')
            ->sortByDesc('money')
            ->take(10)
            ->values();
        return $this->respondWithSuccess([
            'rank' => $mergedRank,
        ]);
    }
}
