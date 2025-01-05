<?php

namespace Database\Factories;

use App\Models\Salary;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SalaryFactory extends Factory
{
    protected $model = Salary::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'amount' => $this->faker->randomFloat(2, 1000, 10000),
            'currency' => $this->faker->randomElement(['USD', 'EUR', 'RSD']),
            'payment_frequency' => $this->faker->randomElement(['monthly', 'yearly']),
        ];
    }
}
