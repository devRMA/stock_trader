<?php

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Response;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\postJson;

it('should return error if the company has no more shares available', function () {
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

    /** @var \App\Models\Company */
    $otherCompany = Company::factory()->create();
    $user->actions()->attach($otherCompany, [
        'amount' => $company->max_actions - 1,
    ]);

    postJson(route('companies.buy_actions', ['company' => $otherCompany]), [
        'amount' => '2',
    ])
        ->assertStatus(Response::HTTP_NOT_ACCEPTABLE);
});

it('should allow buying shares if the user has the money', function () {
    /** @var \App\Models\Company */
    $company = Company::factory()->create();
    /** @var \App\Models\User */
    $user = User::factory()->create();

    Sanctum::actingAs($user, guard:'web');

    postJson(route('companies.buy_actions', ['company' => $company]), [
        'amount' => '1',
    ])
        ->assertOk();
});
