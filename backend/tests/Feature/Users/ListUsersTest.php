<?php

use App\Models\User;
use function Pest\Laravel\getJson;
use Illuminate\Testing\Fluent\AssertableJson;

it('should return the pagination with users order by money', function () {
    foreach (User::factory(20)->create() as $user) {
        $user->money = rand(1, 100);
        $user->save();
    }

    getJson(route('users.index'))
        ->assertOk()
        ->assertJson(fn(AssertableJson $json) =>
            $json->where('total', 20)
                ->has('data', 10)
                ->etc()
        );
});
