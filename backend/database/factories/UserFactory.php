<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'money' => config('game.user.start_money'),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the user has infinite money.
     */
    public function withInfinityMoney(): static
    {
        return $this->state(fn (array $attributes) => [
            'money' => INF,
        ]);
    }

    /**
     * Indicate that the user has no money.
     */
    public function withoutMoney(): static
    {
        return $this->state(fn (array $attributes) => [
            'money' => 0,
        ]);
    }

    /**
     * Indicate that the user has a specific amount of money.
     */
    public function withMoney(int $amount): static
    {
        return $this->state(fn (array $attributes) => [
            'money' => $amount,
        ]);
    }
}
