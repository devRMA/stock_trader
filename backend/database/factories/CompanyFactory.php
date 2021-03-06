<?php

namespace Database\Factories;

use App\Enums\CompanyRisk;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => fake()->company(),
            'sell_amount' => fake()->numberBetween(1, 100),
            'buy_amount' => fake()->numberBetween(1, 100),
            'price' => fake()->numberBetween(1, 100),
            'last_price_update' => now(),
            'risk' => fake()->randomElement(CompanyRisk::values()),
            'max_actions' => fake()->numberBetween(5, 100),
        ];
    }
}
