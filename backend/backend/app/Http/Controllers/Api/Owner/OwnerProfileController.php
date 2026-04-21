<?php

namespace App\Http\Controllers\Api\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class OwnerProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data'    => [
                'id'                   => $user->id,
                'name'                 => $user->name,
                'email'                => $user->email,
                'business_name'        => $user->business_name,
                'business_description' => $user->business_description,
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'business_name'        => ['sometimes', 'required', 'string', 'max:255'],
                'business_description' => ['nullable', 'string', 'max:1000'],
                'name'                 => ['sometimes', 'required', 'string', 'max:255', 'regex:/^[\p{L}\s]+$/u'],
            ]);

            $request->user()->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Perfil actualizado exitosamente',
                'data'    => [
                    'id'                   => $request->user()->id,
                    'name'                 => $request->user()->name,
                    'email'                => $request->user()->email,
                    'business_name'        => $request->user()->business_name,
                    'business_description' => $request->user()->business_description,
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
