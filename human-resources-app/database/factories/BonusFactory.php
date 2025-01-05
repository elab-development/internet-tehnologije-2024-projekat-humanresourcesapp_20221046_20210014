<?php

namespace Database\Factories;

use App\Models\Bonus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class BonusFactory extends Factory
{
    protected $model = Bonus::class;

    public function definition()
    {
        $bonusReasons = [
            'Yearly Performance Bonus',
            'Employee of the Month',
            'Holiday Bonus',
            'Project Completion Reward',
            'Exceptional Work Quality'
        ];

        return [
            'user_id' => User::factory(),
            'amount' => $this->faker->randomFloat(2, 100, 1000),
            'reason' => $this->faker->randomElement($bonusReasons),
            'date_awarded' => Carbon::create(2024, $this->faker->numberBetween(1, 12), 1)->endOfMonth()->format('Y-m-d')
        ];
    }
}
