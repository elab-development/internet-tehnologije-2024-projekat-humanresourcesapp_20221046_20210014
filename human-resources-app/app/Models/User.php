<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'isHr',
        'gender',
        'date_of_birth',
        'contract_start_date'
    ];

    public $timestamps = false;

    public function payslips()
    {
        return $this->hasMany(Payslip::class);
    }

    public function salaries()
    {
        return $this->hasMany(Salary::class);
    }

    public function bonuses()
    {
        return $this->hasMany(Bonus::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
}