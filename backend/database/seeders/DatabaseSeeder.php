<?php

namespace Database\Seeders;

use App\Models\Company;
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
        $now = now();
        Company::create([
            'name'              => 'google',
            'price'             => 500,
            'last_price_change' => $now,
        ]);
        Company::create([
            'name'              => 'facebook',
            'price'             => 500,
            'last_price_change' => $now,
        ]);
        Company::create([
            'name'              => 'discord',
            'price'             => 500,
            'last_price_change' => $now,
        ]);
        Company::create([
            'name'              => 'amazon',
            'price'             => 500,
            'last_price_change' => $now,
        ]);
        Company::create([
            'name'              => 'intel',
            'price'             => 500,
            'last_price_change' => $now,
        ]);
        Company::create([
            'name'              => 'amd',
            'price'             => 500,
            'last_price_change' => $now,
        ]);
    }
}
