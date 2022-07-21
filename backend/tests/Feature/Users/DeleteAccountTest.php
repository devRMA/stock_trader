<?php

use App\Models\User;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\assertGuest;
use function Pest\Laravel\deleteJson;
use Laravel\Sanctum\Sanctum;

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
