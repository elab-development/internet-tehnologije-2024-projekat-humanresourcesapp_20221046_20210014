<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // HR Worker can view all users
    public function index()
    {
        $user = Auth::user();
        if (!$user->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can view all users.'], 403);
        }

        return UserResource::collection(User::all());
    }

    // HR Worker can delete a user
    public function destroy(User $user)
    {
        $userAuth = Auth::user();
        if (!$userAuth->isHr) {
            return response()->json(['error' => 'Unauthorized! Only HR can delete users.'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    // Worker can update their own profile
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:male,female,other',
            'date_of_birth' => 'sometimes|date|before:today',
        ]);

        $user->update($validated);

        return new UserResource($user);
    }
}
