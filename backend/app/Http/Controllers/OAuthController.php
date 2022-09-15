<?php

namespace App\Http\Controllers;

use App\Models\User;
use InvalidArgumentException;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    /**
     * Redirect the user to github oauth url.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function githubProvider()
    {
        return Socialite::driver('github')->redirect();
    }

    /**
     * The callback that will be called, after oauth2.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function githubCallback()
    {
        try {
            $githubUser = Socialite::driver('github')->user();
        } catch (InvalidArgumentException) {
            return redirect()->away(config('urls.frontend.login'));
        }

        /** @var \App\Models\User */
        $user = User::updateOrCreate([
            'email' => $githubUser->getEmail(),
        ], [
            'name' => $githubUser->getNickname(),
            'email_verified_at' => now(),
        ]);

        $user->setAvatarFromUrl($githubUser->getAvatar());

        auth()->login($user);

        return redirect()->away(config('urls.frontend.url'));
    }

    /**
     * Redirect the user to discord oauth url.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function discordProvider()
    {
        return Socialite::driver('discord')->redirect();
    }

    /**
     * The callback that will be called, after oauth2.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function discordCallback()
    {
        try {
            $discordUser = Socialite::driver('discord')->user();
        } catch (InvalidArgumentException) {
            return redirect()->away(config('urls.frontend.login'));
        }

        /** @var \App\Models\User */
        $user = User::updateOrCreate([
            'email' => $discordUser->getEmail(),
        ], [
            'name' => $discordUser->getName(),
            'email_verified_at' => now(),
        ]);

        $user->setAvatarFromUrl($discordUser->getAvatar());

        auth()->login($user);

        return redirect()->away(config('urls.frontend.url'));
    }
}
