<?php

namespace Database\Factories;

use App\Models\Payslip;
use App\Models\User;
use App\Models\Salary;
use App\Models\Bonus;
use Illuminate\Database\Eloquent\Factories\Factory;

class PayslipFactory extends Factory
{
    protected $model = Payslip::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'salary_id' => Salary::factory(),
            'bonus_id' => Bonus::factory(),
            'issue_date' => $this->faker->dateTimeBetween('2024-01-01', '2024-12-31')->format('Y-m-d'),
            'total_amount' => $this->faker->randomFloat(2, 1500, 10000),
        ];
    }
}
