<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $itPositions = [
            'Software Developer',
            'DevOps Engineer',
            'QA Tester',
            'System Administrator',
            'Database Administrator',
            'Network Engineer',
            'Project Manager',
            'Business Analyst',
            'UX/UI Designer',
            'Scrum Master'
        ];

        $isHr = $this->faker->boolean;

        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'isHr' => $isHr,
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'date_of_birth' => $this->faker->dateTimeBetween('1960-01-01', '2001-12-31')->format('Y-m-d'), // Anything between 1960 and 2001
            'contract_start_date' => $this->faker->dateTimeBetween('2009-01-01', '2023-12-31')->format('Y-m-d'), // Between 2009 and 2024
            'position' => $isHr ? 'Human Resources' : $this->faker->randomElement($itPositions),
            'remember_token' => Str::random(10),
        ];
    }
}
