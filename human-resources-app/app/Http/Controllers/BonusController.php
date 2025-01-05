<?php

namespace App\Http\Controllers;

use App\Models\Bonus;
use App\Http\Resources\BonusResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BonusController extends Controller
{
    // HR Worker can view all bonuses
    public function index()
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can view all bonuses.'], 403);
        }

        return BonusResource::collection(Bonus::all());
    }

    // HR Worker can view a specific bonus
    public function show(Bonus $bonus)
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can view bonuses.'], 403);
        }

        return new BonusResource($bonus);
    }

    // HR Worker can create a bonus
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can create bonuses.'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            'reason' => 'required|string',
            'date_awarded' => 'required|date',
        ]);

        $bonus = Bonus::create($validated);
        return new BonusResource($bonus);
    }

    // HR Worker can update a bonus
    public function update(Request $request, Bonus $bonus)
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can update bonuses.'], 403);
        }

        $validated = $request->validate([
            'amount' => 'nullable|numeric',
            'reason' => 'nullable|string',
        ]);

        $bonus->update($validated);
        return new BonusResource($bonus);
    }

    // HR Worker can delete a bonus
    public function destroy(Bonus $bonus)
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can delete bonuses.'], 403);
        }

        $bonus->delete();
        return response()->json(['message' => 'Bonus deleted successfully']);
    }

    // Worker can view their own bonuses
    public function myBonuses()
    {
        $user = Auth::user();
        return BonusResource::collection($user->bonuses);
    }
}
