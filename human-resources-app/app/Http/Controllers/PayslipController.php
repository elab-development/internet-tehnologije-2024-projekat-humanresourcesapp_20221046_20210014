<?php

namespace App\Http\Controllers;

use App\Models\Payslip;
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
     * HR can create a payslip
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
            'issue_date' => 'required|date',
            'total_amount' => 'required|numeric',
        ]);

        $salary = Salary::find($validated['salary_id']);
        $bonus = Bonus::find($validated['bonus_id']);
        $issueDate = Carbon::parse($validated['issue_date']);

        $salaryDate = Carbon::parse($salary->date_issued);
        $bonusDate = Carbon::parse($bonus->date_awarded);

        if (
            $salaryDate->format('Y-m') !== $issueDate->format('Y-m') ||
            $bonusDate->format('Y-m') !== $issueDate->format('Y-m')
        ) {
            return response()->json([
                'error' => 'The Salary, Bonus, and Payslip must belong to the same month and year.'], 422);
        }

        $payslip = Payslip::create($validated);
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

