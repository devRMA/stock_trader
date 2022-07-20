<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Company::create([
            'name' => 'Google',
            'sell_amount' => 0,
            'buy_amount' => 0,
            'price' => random_int(5000, 10000),
            'last_price_update' => now(),
            'max_actions' => 100000,
        ]);
        Company::create([
            'name' => 'Discord',
            'sell_amount' => 0,
            'buy_amount' => 0,
            'price' => random_int(5000, 10000),
            'last_price_update' => now(),
            'max_actions' => 100000,
        ]);
        if (config('app.env')) {
            User::factory(20)->create();
        }
    }
}
