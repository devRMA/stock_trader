<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\putJson;

it('should return error if trying to change password with incorrect current password', function () {
    /** @var \App\Models\User */
    $user = User::factory()->create();

    Sanctum::actingAs($user, guard:'web');

    putJson('user/password', [
        'current_password' => fake()->word,
        'password' => fake()->password,
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'current_password',
        ]);
});

it('should return error if the new password is a weak password', function () {
    /** @var \App\Models\User */
    $user = User::factory()->create();

    Sanctum::actingAs($user, guard:'web');

    putJson('user/password', [
        'current_password' => 'password',
        'password' => '.',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'password',
        ]);
});

it('should update password if validation does not fail', function () {
    /** @var \App\Models\User */
    $user = User::factory()->create();

    Sanctum::actingAs($user, guard:'web');

    putJson('user/password', [
        'current_password' => 'password',
        'password' => 'newPassword',
        'password_confirmation' => 'newPassword',
    ])
        ->assertOk();
});
