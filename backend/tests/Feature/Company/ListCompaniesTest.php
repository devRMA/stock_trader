<?php

use App\Models\Company;
use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\getJson;

it('should return the list of all companies order by name', function () {
    $companies = Company::all();

    getJson(route('companies.index'))
        ->assertOk()
        ->assertJson(fn (AssertableJson $json) => $json->where('total', $companies->count())
                ->has('data', $companies->count())
                ->etc()
        );
});

it('should return the list of all companies that users ', function () {
    $companies = Company::factory(10)->create();
    /** @var \App\Models\User */
    $user = User::factory()->create();
    $user->actions()->sync($companies);

    Sanctum::actingAs($user, guard:'web');

    getJson(route('companies.my_companies'))
        ->assertJson(fn (AssertableJson $json) => $json->where('total', $companies->count())
                ->has('data', $companies->count())
                ->etc()
        );

    assertDatabaseCount('company_user', 10);
});
