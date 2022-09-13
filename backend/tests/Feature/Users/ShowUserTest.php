<?php

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Testing\Fluent\AssertableJson;
use function Pest\Laravel\getJson;

it('should return only public fields from user account ', function () {
    /** @var \App\Models\User */
    $user = User::factory()->create();

    getJson(route('users.show', ['user' => $user]))
        ->assertOk()
        ->assertJson(fn (AssertableJson $json) => $json
                ->hasAll(['id', 'name', 'avatar', 'money', 'created_at'])
                ->missingAll([
                    'email',
                    'updated_at',
                    'password',
                    'remember_token',
                ])
        );
});

it('should return 404 if the user not exists', function () {
    User::factory()->create();

    getJson(route('users.show', ['user' => (string) Str::uuid()]))
        ->assertNotFound();
    getJson(route('users.show', ['user' => Str::random()]))
        ->assertNotFound();
});
