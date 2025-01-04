<?php

// Payslip model
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payslip extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'salary_id',
        'bonus_id',
        'issue_date',
        'total_amount'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function salary()
    {
        return $this->belongsTo(Salary::class);
    }

    public function bonus()
    {
        return $this->belongsTo(Bonus::class);
    }
}
