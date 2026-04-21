<?php

namespace App\Http\Controllers\Api\Owner;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class OwnerCustomerController extends Controller
{
    // Clientes que han reservado con este business_owner
    public function index(Request $request): JsonResponse
    {
        $customers = Customer::where('user_id', $request->user()->id)
            ->with(['linkedUser:id,name,email', 'appointments'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $customers,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name'    => ['required', 'string', 'max:255', 'regex:/^[\p{L}\s]+$/u'],
                'email'   => ['required', 'email:rfc,dns', 'unique:customers,email', 'max:255'],
                'phone'   => ['required', 'string', 'regex:/^[0-9\s\-\+\(\)]+$/', 'min:10', 'max:20'],
                'address' => ['nullable', 'string', 'max:500'],
            ]);

            $validated['user_id'] = $request->user()->id;
            $customer = Customer::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Cliente creado exitosamente',
                'data'    => $customer,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $customer = Customer::where('user_id', $request->user()->id)
            ->with(['linkedUser:id,name,email', 'appointments.service'])
            ->find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Cliente no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $customer,
        ]);
    }

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
                'name'    => ['sometimes', 'required', 'string', 'max:255', 'regex:/^[\p{L}\s]+$/u'],
                'email'   => ['sometimes', 'required', 'email:rfc,dns', 'unique:customers,email,' . $id, 'max:255'],
                'phone'   => ['sometimes', 'required', 'string', 'regex:/^[0-9\s\-\+\(\)]+$/', 'min:10', 'max:20'],
                'address' => ['nullable', 'string', 'max:500'],
            ]);

            $customer->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Cliente actualizado exitosamente',
                'data'    => $customer,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $customer = Customer::where('user_id', $request->user()->id)->find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Cliente no encontrado',
            ], 404);
        }

        if ($customer->appointments()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el cliente porque tiene citas asociadas.',
            ], 422);
        }

        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cliente eliminado exitosamente',
        ]);
    }
}
