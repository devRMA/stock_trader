<?php

namespace App\Http\Controllers;

use App\Models\User;
use InvalidArgumentException;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    public function githubProvider()
    {
        return Socialite::driver('github')->redirect();
    }

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

    public function discordProvider()
    {
        return Socialite::driver('discord')->redirect();
    }

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
