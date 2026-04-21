<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminServiceController extends Controller
{
    // Admin ve TODOS los servicios de todos los business_owners
    public function index(): JsonResponse
    {
        $services = Service::with('user:id,name,email,business_name')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $services,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $service = Service::with(['user:id,name,email,business_name', 'appointments'])
            ->find($id);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Servicio no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $service,
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Servicio no encontrado',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'name'             => ['sometimes', 'required', 'string', 'max:255', 'regex:/^[\p{L}\s\d]+$/u'],
                'description'      => ['nullable', 'string', 'max:1000'],
                'price'            => ['sometimes', 'required', 'numeric', 'min:0', 'max:999999.99'],
                'duration_minutes' => ['sometimes', 'required', 'integer', 'min:1', 'max:1440'],
                'is_active'        => ['boolean'],
            ]);

            $service->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Servicio actualizado exitosamente',
                'data'    => $service,
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
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Servicio no encontrado',
            ], 404);
        }

        if ($service->appointments()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el servicio porque tiene citas asociadas.',
            ], 422);
        }

        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Servicio eliminado exitosamente',
        ]);
    }
}
