<?php

namespace App\Http\Controllers;

use App\Http\Requests\SetUserAvatarRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')
            ->only(
                'update',
                'setAvatar',
                'delete'
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
}
