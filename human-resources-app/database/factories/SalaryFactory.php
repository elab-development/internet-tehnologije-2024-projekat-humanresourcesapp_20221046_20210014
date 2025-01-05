<?php

namespace Database\Factories;

use App\Models\Salary;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class SalaryFactory extends Factory
{
    protected $model = Salary::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'amount' => $this->faker->randomFloat(2, 1000, 5000),
            'currency' => $this->faker->randomElement(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'RSD']),
            'date_issued' => Carbon::create(2024, $this->faker->numberBetween(1, 12), 1)->endOfMonth()->format('Y-m-d')
        ];
    }
}
