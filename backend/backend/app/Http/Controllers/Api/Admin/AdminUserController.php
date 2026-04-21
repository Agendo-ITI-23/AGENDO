<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminUserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::select('id', 'name', 'email', 'role', 'business_name', 'phone', 'created_at')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $users,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $user->makeHidden(['password', 'remember_token']),
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'role'                 => ['sometimes', 'required', 'in:admin,business_owner,customer'],
                'business_name'        => ['nullable', 'string', 'max:255'],
                'business_description' => ['nullable', 'string'],
                'phone'                => ['nullable', 'string', 'regex:/^[0-9\s\-\+\(\)]+$/', 'min:10', 'max:20'],
                'address'              => ['nullable', 'string', 'max:500'],
            ]);

            $user->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente',
                'data'    => $user->makeHidden(['password', 'remember_token']),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado exitosamente',
        ]);
    }
}
