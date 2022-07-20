<?php

use App\Models\User;
use function Pest\Laravel\assertAuthenticatedAs;
use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\assertGuest;
use function Pest\Laravel\assertModelMissing;
use function Pest\Laravel\postJson;

it('should be possible to register a new user account', function () {
    /** @var \App\Models\User */
    $user = User::factory()->make();

    ds($user->email, User::all()->pluck('email'));

    postJson('register', [
        'name' => $user->name,
        'email' => $user->email,
        'password' => '#@Password123@#',
        'password_confirmation' => '#@Password123@#',
    ])
        ->assertCreated();

    assertDatabaseHas(User::class, [
        'email' => $user->email,
    ]);
    assertDatabaseCount(User::class, 1);

    /** @var \App\Models\User */
    $createdUser = User::where('email', $user->email)->first();
    assertAuthenticatedAs($createdUser);
});

it('should return error, if there exists user with this e-mail', function () {
    /** @var \App\Models\User */
    $user = User::factory()->create();
    /** @var \App\Models\User */
    $other = User::factory()->make();

    postJson('register', [
        'name' => $other->name,
        'email' => $user->email,
        'password' => '#@Password123@#',
        'password_confirmation' => '#@Password123@#',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'email',
        ]);

    assertDatabaseMissing(User::class, [
        'name' => $other->name,
    ]);
    assertDatabaseCount(User::class, 1);
    assertModelMissing($other);

    assertGuest();
});

it('should return 422 if there is an error in some validation', function () {
    postJson('register')
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'name',
            'email',
            'password',
        ]);
});
