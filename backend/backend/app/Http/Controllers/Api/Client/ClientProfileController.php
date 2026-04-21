<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ClientProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data'    => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'phone'   => $user->phone,
                'address' => $user->address,
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name'    => ['sometimes', 'required', 'string', 'max:255', 'regex:/^[\p{L}\s]+$/u'],
                'phone'   => ['sometimes', 'required', 'string', 'regex:/^[0-9\s\-\+\(\)]+$/', 'min:10', 'max:20'],
                'address' => ['nullable', 'string', 'max:500'],
            ]);

            $user = $request->user();
            $user->update($validated);

            // Sincronizar nombre/teléfono/dirección en todos los registros Customer vinculados
            Customer::where('linked_user_id', $user->id)->update([
                'name'    => $validated['name']    ?? $user->name,
                'phone'   => $validated['phone']   ?? $user->phone,
                'address' => $validated['address'] ?? $user->address,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Perfil actualizado exitosamente',
                'data'    => [
                    'id'      => $user->id,
                    'name'    => $user->name,
                    'email'   => $user->email,
                    'phone'   => $user->phone,
                    'address' => $user->address,
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
}
