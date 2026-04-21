<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'          => ['required', 'string', 'max:255', 'regex:/^[\p{L}\s]+$/u'],
                'email'         => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users'],
                'password'      => ['required', 'string', 'min:8', 'confirmed', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'],
                'role'          => ['required', 'in:business_owner,customer'],
                'business_name' => ['required_if:role,business_owner', 'nullable', 'string', 'max:255'],
                'phone'         => ['required_if:role,customer', 'nullable', 'string', 'regex:/^[0-9\s\-\+\(\)]+$/', 'min:10', 'max:20'],
                'address'       => ['nullable', 'string', 'max:500'],
            ]);

            $user = User::create([
                'name'                 => $validated['name'],
                'email'                => $validated['email'],
                'password'             => Hash::make($validated['password']),
                'role'                 => $validated['role'],
                'business_name'        => $validated['business_name'] ?? null,
                'business_description' => $request->input('business_description'),
                'phone'                => $validated['phone'] ?? null,
                'address'              => $validated['address'] ?? null,
            ]);

            // Si el usuario es cliente, crear un perfil Customer base sin owner
            // (se vinculará a un business_owner cuando haga su primera reserva)
            if ($user->role === 'customer') {
                Customer::create([
                    'name'           => $user->name,
                    'email'          => $user->email,
                    'phone'          => $user->phone ?? '',
                    'address'        => $user->address,
                    'user_id'        => null,
                    'linked_user_id' => $user->id,
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Usuario registrado exitosamente',
                'data'    => [
                    'user'  => $this->formatUser($user),
                    'token' => $token,
                ],
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email'    => ['required', 'string', 'email:rfc', 'max:255'],
                'password' => ['required', 'string'],
            ]);

            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Credenciales incorrectas',
                ], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Inicio de sesión exitoso',
                'data'    => [
                    'user'  => $this->formatUser($user),
                    'token' => $token,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada exitosamente',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'user' => $this->formatUser($request->user()),
            ],
        ]);
    }

    private function formatUser(User $user): array
    {
        $data = [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role,
        ];

        if ($user->role === 'business_owner') {
            $data['business_name']        = $user->business_name;
            $data['business_description'] = $user->business_description;
        }

        if ($user->role === 'customer') {
            $data['phone']   = $user->phone;
            $data['address'] = $user->address;
        }

        return $data;
    }
}
