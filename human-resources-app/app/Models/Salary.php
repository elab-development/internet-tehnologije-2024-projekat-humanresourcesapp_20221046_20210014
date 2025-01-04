<?php

// Salary model
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salary extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'currency',
        'payment_frequency' 
    ];

    public function payslips()
    {
        return $this->hasMany(Payslip::class);
    }
}
