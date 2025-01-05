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

      // ✅ Salary Routes
      Route::prefix('salaries')->group(function () {
        Route::get('/', [SalaryController::class, 'index']); 
        Route::get('/{salary}', [SalaryController::class, 'show']);
        Route::post('/', [SalaryController::class, 'store']); 
        Route::put('/{salary}', [SalaryController::class, 'update']); 
        Route::delete('/{salary}', [SalaryController::class, 'destroy']);
    });
    // Worker-specific salary route
    Route::get('my-salary', [SalaryController::class, 'mySalary']); 

    // ✅ Bonus Routes
    Route::prefix('bonuses')->group(function () {
        Route::get('/', [BonusController::class, 'index']);
        Route::get('/{bonus}', [BonusController::class, 'show']); 
        Route::post('/', [BonusController::class, 'store']); 
        Route::put('/{bonus}', [BonusController::class, 'update']); 
        Route::delete('/{bonus}', [BonusController::class, 'destroy']); 
    });
    // Worker-specific bonus route
    Route::get('my-bonuses', [BonusController::class, 'myBonuses']); 

    // ✅ Payslip Routes
    Route::prefix('payslips')->group(function () {
        Route::get('/', [PayslipController::class, 'index']); 
        Route::get('/{payslip}', [PayslipController::class, 'show']); 
        Route::post('/', [PayslipController::class, 'store']); 
        Route::delete('/{payslip}', [PayslipController::class, 'destroy']); 
    });
    // Worker-specific payslip route
    Route::get('my-payslips', [PayslipController::class, 'myPayslips']); 

    // ✅ User Routes
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']); 
        Route::delete('/{user}', [UserController::class, 'destroy']); 
    });
    // Worker-specific user route
    Route::put('profile/update', [UserController::class, 'update']); 

    Route::post('/logout', [AuthController::class, 'logout']);
});