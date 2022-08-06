<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\assertGuest;
use function Pest\Laravel\postJson;

it('should return 204 if user is not logged in', function () {
    postJson(route('logout'))
        ->assertNoContent();
});

it('should remove the login of the user who is logged in', function () {
    /** @var \App\Models\User */
    $user = User::factory()->create();

    Sanctum::actingAs($user, guard:'web');

    postJson(route('logout'))
        ->assertNoContent();

    assertGuest('web');
});
