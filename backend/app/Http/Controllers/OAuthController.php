<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use GuzzleHttp\Exception\ClientException;
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
            return $this->redirectWith(config('urls.frontend.login'), [
                'code' => 1,
            ]);
        } catch (ClientException) {
            return $this->redirectWith(config('urls.frontend.login'), [
                'code' => 2,
            ]);
        } catch (Exception) {
            return $this->redirectWith(config('urls.frontend.login'), [
                'code' => 3,
            ]);
        }

        /** @var \App\Models\User|null */
        $user = User::firstWhere('email', $githubUser->getEmail());

        if ($user === null) {
            /** @var \App\Models\User */
            $user = User::create([
                'name'              => $githubUser->getNickname(),
                'email'             => $githubUser->getEmail(),
                'email_verified_at' => now(),
            ]);
            $user->setAvatarFromUrl($githubUser->getAvatar());
        }

        auth()->login($user);

        return $this->redirectWith(config('urls.frontend.url'));
    }

    /**
     * Redirect the user to google oauth url.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function googleProvider()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * The callback that will be called, after oauth2.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function googleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (InvalidArgumentException) {
            return $this->redirectWith(config('urls.frontend.login'), [
                'code' => 1,
            ]);
        } catch (ClientException) {
            return $this->redirectWith(config('urls.frontend.login'), [
                'code' => 2,
            ]);
        } catch (Exception) {
            return $this->redirectWith(config('urls.frontend.login'), [
                'code' => 3,
            ]);
        }

        /** @var \App\Models\User|null */
        $user = User::firstWhere('email', $googleUser->getEmail());

        if ($user === null) {
            /** @var \App\Models\User */
            $user = User::create([
                'name'              => head(explode(' ', $googleUser->getName())),
                'email'             => $googleUser->getEmail(),
                'email_verified_at' => now(),
            ]);
            $user->setAvatarFromUrl($googleUser->getAvatar());
        }

        auth()->login($user);

        return $this->redirectWith(config('urls.frontend.url'));
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
            return $this->redirectWith(config('urls.frontend.login'), [
                'code' => 1,
            ]);
        } catch (ClientException) {
            return $this->redirectWith(config('urls.frontend.login'), [
                'code' => 2,
            ]);
        } catch (Exception) {
            return $this->redirectWith(config('urls.frontend.login'), [
                'code' => 3,
            ]);
        }

        /** @var \App\Models\User|null */
        $user = User::firstWhere('email', $discordUser->getEmail());

        if ($user === null) {
            /** @var \App\Models\User */
            $user = User::create([
                'name'              => $discordUser->getName(),
                'email'             => $discordUser->getEmail(),
                'email_verified_at' => now(),
            ]);
            $user->setAvatarFromUrl($discordUser->getAvatar());
        }

        auth()->login($user);

        return $this->redirectWith(config('urls.frontend.url'));
    }

    /**
     * Redirect to url with data in query parameters
     *
     * @param string $to
     * @param array<string, mixed> $bag
     * @return \Illuminate\Http\RedirectResponse
     */
    protected function redirectWith(string $to, array $bag = [])
    {
        $url = count($bag) > 0 ? ($to . '?' . http_build_query($bag)) : $to;
        return redirect()->away($url);
    }
}
