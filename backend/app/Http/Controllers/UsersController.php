<?php

namespace App\Http\Controllers;

use App\Http\Requests\SetUserAvatarRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')
            ->except(
                'index',
                'show',
            );
        $this->middleware('forbid-banned-user');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()
            ->json(new UserCollection(
                Cache::remember(
                    'users'.request()->get('page', 1),
                    120,
                    fn () => User::withoutBanned()
                        ->orderBy('money', 'desc')
                        ->fastPaginate(10)
                )
            ));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        abort_if(
            $user->isBanned(),
            Response::HTTP_NOT_FOUND
        );

        return response()
            ->json(new UserResource($user));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateUserRequest  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        abort_unless($user->id == auth()->id(), 403);

        $user->update($request->validated());

        return response()
            ->json(new UserResource($user->fresh()->showPrivatesAttributes()));
    }

    /**
     * Updates the avatar of the logged user.
     *
     * @param  \App\Http\Requests\SetUserAvatarRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function setAvatar(SetUserAvatarRequest $request)
    {
        /** @var \App\Models\User */
        $user = auth()->user();
        $user->setAvatar($request->validated('avatar'));

        return response()->json('');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        abort_unless($user->id == auth()->id(), 403);

        auth()->logout();
        session()->invalidate();
        session()->regenerateToken();

        $user->delete();

        return response()->noContent();
    }

    /**
     * Ban a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function ban(Request $request, User $user)
    {
        /** @var \App\Models\User */
        $loggedUser = auth()->user();

        abort_unless(
            $loggedUser->admin,
            Response::HTTP_NOT_FOUND,
        );

        abort_if(
            $user->isBanned(),
            Response::HTTP_CONFLICT,
            'already banned'
        );

        $user->ban([
            'comment' => $request->get('reason'),
        ]);

        return response()->json('');
    }

    /**
     * Removes a user's ban.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function unban(User $user)
    {
        /** @var \App\Models\User */
        $loggedUser = auth()->user();

        abort_unless(
            $loggedUser->admin,
            Response::HTTP_NOT_FOUND,
        );

        abort_if(
            ! $user->isBanned(),
            Response::HTTP_CONFLICT,
            'already unbanned'
        );

        $user->unban();

        return response()->json('');
    }
}
