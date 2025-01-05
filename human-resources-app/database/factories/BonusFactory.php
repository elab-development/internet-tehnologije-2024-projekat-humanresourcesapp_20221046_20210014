<?php

namespace Database\Factories;

use App\Models\Bonus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BonusFactory extends Factory
{
    protected $model = Bonus::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'amount' => $this->faker->randomFloat(2, 100, 1000),
            'reason' => $this->faker->sentence,
            'date_awarded' => $this->faker->dateTimeBetween('2024-01-01', '2024-12-31')->format('Y-m-d'),
        ];
    }
}
