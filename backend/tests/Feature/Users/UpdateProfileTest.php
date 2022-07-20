<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\putJson;

it('should change the profile information of the logged in user', function () {
    /** @var \App\Models\User */
    $user = User::factory()->create();

    /** @var \App\Models\User */
    $other = User::factory()->make();

    Sanctum::actingAs($user);

    putJson(route('users.update', ['user' => $user]), [
        'name'       => $other->name,
        'email'      => $user->email,
    ])
        ->assertOk();

    $user->refresh();

    expect($user->name)->toBe($other->name)
        ->and($user->hasVerifiedEmail())->toBeTrue();
});
