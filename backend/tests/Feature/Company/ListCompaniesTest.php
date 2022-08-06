<?php

use App\Models\Company;
use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\getJson;
use function Spatie\PestPluginTestTime\testTime;

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

it('should change the actions price after a certain time', function () {
    testTime()->freeze();

    /** @var \App\Models\Company */
    $company = Company::factory()->create();

    getJson(route('companies.index'))->assertOk();

    $originalPrice = $company->fresh()->price;

    testTime()->addSeconds(config('game.company.reset_after') + 1);

    getJson(route('companies.index'))->assertOk();

    expect($company->fresh()->price)->not->toBe($originalPrice);
});

it('should return the seconds left for the next price update', function () {
    testTime()->freeze();

    getJson(route('companies.update_in'))
        ->assertOk()
        ->assertJsonFragment([
            'seconds' => config('game.company.reset_after'),
        ]);
});
