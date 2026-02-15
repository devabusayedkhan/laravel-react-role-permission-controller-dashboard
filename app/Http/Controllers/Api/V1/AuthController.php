<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
        {
            try {
                $data = $request->validate([
                    'name' => ['required', 'string', 'max:100'],
                    'email' => ['required', 'email', 'unique:users,email'],
                    'password' => ['required', 'string', 'min:8', 'confirmed'],
                ]);

                $user = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make($data['password']),
                ]);

                return response()->json([
                    'message' => 'Registered successfully',
                    'user' => $user,
                ], 201);
            } catch (ValidationException $e) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ], 422);
            } catch (QueryException $e) {
                return response()->json([
                    'message' => 'Database error',
                ], 500);
            } catch (\Throwable $e) {
                return response()->json([
                    'message' => 'Something went wrong',
                ], 500);
            }
        }

        public function login(Request $request)
        {
            try {
                $data = $request->validate([
                    'email' => ['required', 'email'],
                    'password' => ['required', 'string'],
                ]);

                $user = User::where('email', $data['email'])->first();

                if (!$user || !Hash::check($data['password'], $user->password)) {
                    throw ValidationException::withMessages([
                        'email' => ['Invalid credentials.'],
                    ]);
                }

                // আগের token থাকলে মুছে ফেলি (optional but recommended)
                $user->tokens()->delete();

                // Sanctum token create
                $token = $user->createToken('api-token')->plainTextToken;

                return response()->json([
                    'message' => 'Logged in successfully',
                    'token'   => $token,
                    'user'    => $user,
                ], 200);
            } catch (ValidationException $e) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors'  => $e->errors(),
                ], 422);
            } catch (QueryException $e) {
                return response()->json([
                    'message' => 'Database error',
                ], 500);
            } catch (\Throwable $e) {
                return response()->json([
                    'message' => 'Something went wrong',
                ], 500);
            }
        }

        public function me(Request $request)
        {
            try {
                $user = $request->user();

                if (!$user) {
                    return response()->json([
                        'message' => 'Unauthenticated',
                    ], 401);
                }

                return response()->json([
                    'user' => $user,
                    // future: 'roles' => $user->roles,
                    // future: 'permissions' => $user->getAllPermissions(),
                ], 200);
            } catch (\Throwable $e) {
                return response()->json([
                    'message' => 'Something went wrong',
                ], 500);
            }
        }

        public function logout(Request $request)
        {
            try {
                // বর্তমান access token delete
                $request->user()->currentAccessToken()->delete();

                return response()->json([
                    'message' => 'Logged out successfully',
                ], 200);

            } catch (\Throwable $e) {

                Log::error('API Logout Error', [
                    'error' => $e->getMessage(),
                ]);

                return response()->json([
                    'message' => 'Failed to logout',
                ], 500);
            }
        }
}
