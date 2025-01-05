<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Salary;
use App\Models\Bonus;
use App\Models\Payslip;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::factory()->count(10)->create()->each(function ($user) {
            // Generisi 4 unikatna meseca za svakog user-a
            $months = collect(range(1, 12))->random(4)->map(function ($month) {
                return Carbon::create(2024, $month, 1)->endOfMonth()->format('Y-m-d');
            });

            foreach ($months as $date) {
                // Generisi platu za svakog user-a u datom mesecu
                $salary = Salary::factory()->create([
                    'user_id' => $user->id,
                    'date_issued' => $date
                ]);

                // Generisi Bonus za svakog user-a u istom mesecu
                $bonus = Bonus::factory()->create([
                    'user_id' => $user->id,
                    'date_awarded' => $date
                ]);

                // Generisi platni listic za istog korisnika, 
                //koristeci isti bonus i istu platu za isti datum
                Payslip::create([
                    'user_id' => $user->id,
                    'salary_id' => $salary->id,
                    'bonus_id' => $bonus->id,
                    'issue_date' => $date,
                    'total_amount' => $salary->amount + $bonus->amount
                ]);
            }
        });
    }
}
