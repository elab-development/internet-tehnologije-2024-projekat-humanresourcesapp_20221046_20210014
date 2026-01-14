<?php

namespace App\Http\Controllers;

use App\Models\Payslip;
use Carbon\Carbon;
use App\Models\Salary;
use App\Models\Bonus;
use Illuminate\Http\Request;
use App\Http\Resources\PayslipResource;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

    /* HR can export all payslips as CSV.
     * GET /api/payslips/export/csv
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can export payslips.'], 403);
        }

        $filename = 'payslips_' . now()->format('Ymd_His') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
            'Cache-Control'       => 'no-store, no-cache',
        ];

        $callback = function () {
            $out = fopen('php://output', 'w');

            // UTF-8 BOM for Excel compatibility
            fprintf($out, chr(0xEF).chr(0xBB).chr(0xBF));

            // CSV header
            fputcsv($out, [
                'Payslip ID',
                'Issue Date',
                'Total Amount',
                'User ID',
                'User Name',
                'User Email',
                'Salary ID',
                'Salary Amount',
                'Salary Currency',
                'Salary Date Issued',
                'Bonus ID',
                'Bonus Amount',
                'Bonus Reason',
                'Bonus Date Awarded',
            ]);

            // Pull data with relations
            $payslips = Payslip::with(['user', 'salary', 'bonus'])
                ->orderBy('issue_date', 'desc')
                ->get();

            foreach ($payslips as $p) {
                fputcsv($out, [
                    $p->id,
                    $p->issue_date,
                    $p->total_amount,
                    optional($p->user)->id,
                    optional($p->user)->name,
                    optional($p->user)->email,
                    optional($p->salary)->id,
                    optional($p->salary)->amount,
                    optional($p->salary)->currency,
                    optional($p->salary)->date_issued,
                    optional($p->bonus)->id,
                    optional($p->bonus)->amount,
                    optional($p->bonus)->reason,
                    optional($p->bonus)->date_awarded,
                ]);
            }

            fclose($out);
        };

        return response()->stream($callback, 200, $headers);
    }
}

