<?php
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SalaryController;
use App\Http\Controllers\BonusController;
use App\Http\Controllers\PayslipController;

Route::post('/register', [AuthController::class, 'register']); 
Route::post('/login', [AuthController::class, 'login']); 

Route::middleware('auth:sanctum')->group(function () {

    // Worker-specific salary route
    Route::get('my-salary', [SalaryController::class, 'mySalary']); 

    // Salary Routes
    Route::apiResource('salaries', SalaryController::class);

    // Bonus Routes
    Route::prefix('bonuses')->group(function () {
        Route::get('/', [BonusController::class, 'index']);
        Route::get('/{bonus}', [BonusController::class, 'show']); 
        Route::post('/', [BonusController::class, 'store']); 
        Route::patch('/{bonus}', [BonusController::class, 'update']); 
        Route::delete('/{bonus}', [BonusController::class, 'destroy']); 
    });
    // Worker-specific bonus route
    Route::get('my-bonuses', [BonusController::class, 'myBonuses']); 

    // Payslip Routes
    Route::prefix('payslips')->group(function () {
        Route::get('/', [PayslipController::class, 'index']); 
        Route::get('/{payslip}', [PayslipController::class, 'show']); 
        Route::post('/', [PayslipController::class, 'store']); 
        Route::delete('/{payslip}', [PayslipController::class, 'destroy']); 
    });
    // Worker-specific payslip route
    Route::get('my-payslips', [PayslipController::class, 'myPayslips']); 

    // User Routes
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']); 
        Route::delete('/{user}', [UserController::class, 'destroy']); 
    });
    // Worker-specific user route
    Route::patch('profile/update', [UserController::class, 'update']); 

    Route::post('/logout', [AuthController::class, 'logout']);
});