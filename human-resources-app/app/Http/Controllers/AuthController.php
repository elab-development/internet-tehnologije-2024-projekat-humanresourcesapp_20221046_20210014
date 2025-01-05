<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'isHr' => 'required|boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'isHr' => $validated['isHr'],
        ]);

        $role = $user->isHr ? 'HR Worker' : 'Worker';
        $message = "✅ $role registered successfully.";

        return response()->json([
            'message' => $message,
            'user' => new UserResource($user)
        ], 201);
    }

    /**
     * Log in an existing user.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string|min:8',
        ]);

        if (!Auth::attempt($validated)) {
            return response()->json(['error' => 'Invalid login credentials! ❌'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        $role = $user->isHr ? 'HR Worker' : 'Worker';
        $message = "✅ $role logged in successfully.";

        return response()->json([
            'message' => $message,
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    /**
     * Log out the user and revoke token.
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();

        $role = $user->isHr ? 'HR Worker' : 'Worker';
        $message = "✅ $role logged out successfully.";

        return response()->json(['message' => $message]);
    }
}
