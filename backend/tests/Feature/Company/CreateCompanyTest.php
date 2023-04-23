<?php

use App\Models\Company;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

use function Pest\Faker\fake;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\postJson;

it('should return error when the user tries to create a company, without money', function () {
    /** @var \App\Models\User */
    $user = User::factory()->withoutMoney()->create();
    $companyName = fake()->name;

    Sanctum::actingAs($user, guard: 'web');

    postJson(route('companies.create'), [
        'name' => $companyName,
    ])
        ->assertPaymentRequired();

    assertDatabaseMissing(Company::class, [
        'name' => $companyName,
    ]);
});

it("should decrease the user's money, after he creates a company", function () {
    /** @var \App\Models\User */
    $user = User::factory()->withMoney(config('game.company.price_to_create') * 2)->create();

    Sanctum::actingAs($user, guard: 'web');

    postJson(route('companies.create'), [
        'name' => fake()->name,
    ])
        ->assertCreated();

    $user->refresh();

    expect($user->money)->toEqual(config('game.company.price_to_create'));
});

it('should save the company in the database, when the user creates a new company', function () {
    /** @var \App\Models\User */
    $user = User::factory()->withInfinityMoney()->create();
    $companyName = fake()->name;

    Sanctum::actingAs($user, guard: 'web');

    postJson(route('companies.create'), [
        'name' => $companyName,
    ])
        ->assertCreated();

    assertDatabaseHas(Company::class, [
        'name' => $companyName,
    ]);
});

it('should return 422 if the post is invalid', function () {
    /** @var \App\Models\User */
    $user = User::factory()->withInfinityMoney()->create();

    Sanctum::actingAs($user, guard: 'web');

    postJson(route('companies.create'))
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'name',
        ]);
});
