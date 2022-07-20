<?php

use App\Models\User;
use function Pest\Laravel\assertAuthenticatedAs;
use function Pest\Laravel\assertGuest;
use function Pest\Laravel\postJson;

it('should be possible to log into a user account that already exists', function () {
    /** @var \App\Models\User */
    $user = User::factory()->create();

    postJson('login', [
        'email' => $user->email,
        'password' => 'password',
    ])
        ->assertOk();

    assertAuthenticatedAs($user);
});

it('should return error, if there is a validation error in some field', function () {
    postJson('login', [
        'email' => '',
        'password' => '',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'email',
            'password',
        ]);

    assertGuest();
});

it('should return error, if there exists user with this e-mail, but the password is wrong', function () {
    /** @var \App\Models\User */
    $user = User::factory()->create();

    postJson('login', [
        'email' => $user->email,
        'password' => 'wrong password',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('email');

    assertGuest();
});
