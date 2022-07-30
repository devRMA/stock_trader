<?php

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Response;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

it('should return error if the user has no actions in the company to sell', function () {
    /** @var \App\Models\Company */
    $company = Company::factory()->create();
    /** @var \App\Models\User */
    $user = User::factory()->create();

    Sanctum::actingAs($user, guard:'web');

    putJson(route('companies.sell_actions', ['company' => $company]), [
        'amount' => '1',
    ])
        ->assertStatus(Response::HTTP_NOT_ACCEPTABLE);
});

it('should increase the amount of sales the company has had', function () {
    /** @var \App\Models\Company */
    $company = Company::factory()->create();
    /** @var \App\Models\User */
    $user = User::factory()->create();
    $originalAmount = $company->sell_amount;

    $user->actions()->attach($company, [
        'amount' => 1,
    ]);

    Sanctum::actingAs($user, guard:'web');

    putJson(route('companies.sell_actions', ['company' => $company]), [
        'amount' => '1',
    ])
        ->assertOk();

    expect($company->fresh()->sell_amount)->toBe($originalAmount + 1);
});

it("should increase user's money after sale", function () {
    /** @var \App\Models\Company */
    $company = Company::factory()->create();
    /** @var \App\Models\User */
    $user = User::factory()->create();
    $originalMoney = $user->money;

    $user->actions()->attach($company, [
        'amount' => 1,
    ]);

    Sanctum::actingAs($user, guard:'web');

    putJson(route('companies.sell_actions', ['company' => $company]), [
        'amount' => '1',
    ])
        ->assertOk();

    expect($user->fresh()->money)->toBe($originalMoney + $company->price);
});

it('should be possible to buy the action after the sale', function () {
    /** @var \App\Models\Company */
    $company = Company::factory()->create();
    /** @var \App\Models\User */
    $user = User::factory()->create();

    $user->actions()->attach($company, [
        'amount' => $company->max_actions,
    ]);

    Sanctum::actingAs($user, guard:'web');

    postJson(route('companies.buy_actions', ['company' => $company]), [
        'amount' => '1',
    ])
        ->assertStatus(Response::HTTP_NOT_ACCEPTABLE);

    putJson(route('companies.sell_actions', ['company' => $company]), [
        'amount' => '1',
    ])
        ->assertOk();

    postJson(route('companies.buy_actions', ['company' => $company]), [
        'amount' => '2',
    ])
        ->assertStatus(Response::HTTP_NOT_ACCEPTABLE);

    postJson(route('companies.buy_actions', ['company' => $company]), [
        'amount' => '1',
    ])
        ->assertOk();
});
