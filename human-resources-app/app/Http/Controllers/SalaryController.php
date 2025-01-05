<?php

namespace App\Http\Controllers;

use App\Models\Salary;
use App\Http\Resources\SalaryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SalaryController extends Controller
{
    // Only HR can view all salaries
    public function index()
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can access this resource.'], 403);
        }

        return SalaryResource::collection(Salary::all());
    }

    // HR can view a specific salary
    public function show(Salary $salary)
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can access this resource.'], 403);
        }

        return new SalaryResource($salary);
    }

    // HR can create a salary
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can create salaries.'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            'currency' => 'required|string',
            'date_issued' => 'required|date',
        ]);

        $salary = Salary::create($validated);
        return new SalaryResource($salary);
    }

    // HR can update a salary
    public function update(Request $request, Salary $salary)
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can update salaries.'], 403);
        }

        $validated = $request->validate([
            'amount' => 'nullable|numeric',
            'currency' => 'nullable|string',
        ]);

        $salary->update($validated);
        return new SalaryResource($salary);
    }

    // HR can delete a salary
    public function destroy(Salary $salary)
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can delete salaries.'], 403);
        }

        $salary->delete();
        return response()->json(['message' => 'Salary deleted successfully']);
    }

    // Worker can view only their own salary
    public function mySalary()
    {
        $user = Auth::user();
        return SalaryResource::collection($user->salaries);
    }
}
