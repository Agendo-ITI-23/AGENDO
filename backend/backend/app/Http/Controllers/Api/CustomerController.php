<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $customers = Customer::where('user_id', $request->user()->id)
            ->with('appointments')
            ->latest()
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $customers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255', 'regex:/^[\p{L}\s]+$/u'],
                'email' => ['required', 'email:rfc,dns', 'unique:customers,email', 'max:255'],
                'phone' => ['required', 'string', 'regex:/^[0-9\s\-\+\(\)]+$/', 'min:10', 'max:20'],
                'address' => 'nullable|string|max:500',
            ]);

            $validated['user_id'] = $request->user()->id;
            $customer = Customer::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Cliente creado exitosamente',
                'data' => $customer,
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
    public function show(Request $request, string $id): JsonResponse
    {
        $customer = Customer::where('user_id', $request->user()->id)
            ->with('appointments.service')
            ->find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Cliente no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $customer,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $customer = Customer::where('user_id', $request->user()->id)->find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Cliente no encontrado',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'name' => ['sometimes', 'required', 'string', 'max:255', 'regex:/^[\p{L}\s]+$/u'],
                'email' => ['sometimes', 'required', 'email:rfc,dns', 'unique:customers,email,' . $id, 'max:255'],
                'phone' => ['sometimes', 'required', 'string', 'regex:/^[0-9\s\-\+\(\)]+$/', 'min:10', 'max:20'],
                'address' => 'nullable|string|max:500',
            ]);

            $customer->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Cliente actualizado exitosamente',
                'data' => $customer,
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
    public function destroy(Request $request, string $id): JsonResponse
    {
        $customer = Customer::where('user_id', $request->user()->id)->find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Cliente no encontrado',
            ], 404);
        }

        // Verificar si el cliente tiene citas asociadas
        if ($customer->appointments()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el cliente porque tiene citas asociadas. Elimine las citas primero.',
            ], 422);
        }

        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cliente eliminado exitosamente',
        ]);
    }
}
