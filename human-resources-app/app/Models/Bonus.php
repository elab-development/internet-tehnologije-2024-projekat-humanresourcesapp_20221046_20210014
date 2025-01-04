<?php

// Bonus model
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bonus extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'reason',       
        'date_awarded'
    ];

    public function payslips()
    {
        return $this->hasMany(Payslip::class);
    }
}
