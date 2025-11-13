<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $services = Service::latest()->get();
        
        return response()->json([
            'success' => true,
            'data' => $services,
        ]);
    }

    /**
     * Get only active services.
     */
    public function active(): JsonResponse
    {
        $services = Service::where('is_active', true)->latest()->get();
        
        return response()->json([
            'success' => true,
            'data' => $services,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'duration_minutes' => 'required|integer|min:1',
                'is_active' => 'boolean',
            ]);

            $service = Service::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Servicio creado exitosamente',
                'data' => $service,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $service = Service::with('appointments')->find($id);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Servicio no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $service,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
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
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'sometimes|required|numeric|min:0',
                'duration_minutes' => 'sometimes|required|integer|min:1',
                'is_active' => 'boolean',
            ]);

            $service->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Servicio actualizado exitosamente',
                'data' => $service,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Servicio no encontrado',
            ], 404);
        }

        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Servicio eliminado exitosamente',
        ]);
    }
}
