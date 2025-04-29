<?php

namespace App\Http\Controllers;

use App\Models\Payslip;
use Carbon\Carbon;
use App\Models\Salary;
use App\Models\Bonus;
use Illuminate\Http\Request;
use App\Http\Resources\PayslipResource;
use Illuminate\Support\Facades\Auth;

class PayslipController extends Controller
{
    /**
     * HR can see all payslips
     */
    public function index()
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can view all payslips.'], 403);
        }

        return PayslipResource::collection(Payslip::all());
    }

    /**
     * HR can view a specific payslip
     */
    public function show(Payslip $payslip)
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can view specific payslips.'], 403);
        }

        return new PayslipResource($payslip);
    }

    /**
     * HR can create a payslip only if Salary, Bonus, and Payslip match the same month
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can create payslips.'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'salary_id' => 'required|exists:salaries,id',
            'bonus_id' => 'required|exists:bonuses,id',
        ]);

        // Fetch the salary and bonus records
        $salary = Salary::findOrFail($validated['salary_id']);
        $bonus = Bonus::findOrFail($validated['bonus_id']);

        // Ensure salary and bonus belong to the same month and year
        $salaryDate = Carbon::parse($salary->date_issued);
        $bonusDate = Carbon::parse($bonus->date_awarded);

        if ($salaryDate->format('Y-m') !== $bonusDate->format('Y-m')) {
            return response()->json([
                'error' => 'The Salary and Bonus must belong to the same month and year.'
            ], 422);
        }

        // Automatically calculate the total amount and set the issue date from salary/bonus
        $totalAmount = $salary->amount + $bonus->amount;
        $issueDate = $salaryDate->endOfMonth()->format('Y-m-d'); // Ensuring the end of the month

        // Create the payslip using calculated values
        $payslip = Payslip::create([
            'user_id' => $validated['user_id'],
            'salary_id' => $validated['salary_id'],
            'bonus_id' => $validated['bonus_id'],
            'issue_date' => $issueDate,  // Date auto-derived from salary/bonus
            'total_amount' => $totalAmount
        ]);

        return new PayslipResource($payslip);
    }


    /**
     * HR can delete a payslip
     */
    public function destroy(Payslip $payslip)
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can delete payslips.'], 403);
        }

        $payslip->delete();
        return response()->json(['message' => 'Payslip deleted successfully']);
    }

    /**
     * Worker can only view their own payslips
     */
    public function myPayslips()
    {
        $user = Auth::user();
        $payslips = $user->payslips;
        return PayslipResource::collection($payslips);
    }
}

