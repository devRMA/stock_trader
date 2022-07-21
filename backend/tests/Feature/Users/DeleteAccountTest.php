<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\assertGuest;
use function Pest\Laravel\deleteJson;

it('should remove account from the database if user delete account', function () {
    /** @var \App\Models\User */
    $user = User::factory()->create();

    Sanctum::actingAs($user, guard:'web');

    deleteJson(route('users.destroy', ['user' => $user]))
        ->assertNoContent();

    assertDatabaseMissing(User::class, [
        'email' => $user->email,
    ]);
    assertGuest('web');
});

it('should return error if try delete account without login', function () {
    /** @var \App\Models\User */
    $user = User::factory()->create();
    /** @var \App\Models\User */
    $other = User::factory()->create();

    Sanctum::actingAs($user, guard:'web');

    deleteJson(route('users.destroy', ['user' => $other]))
        ->assertForbidden();
});
