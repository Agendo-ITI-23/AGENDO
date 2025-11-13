<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['customer', 'service', 'user'])
            ->where('user_id', $request->user()->id);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('appointment_date', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('appointment_date', '<=', $request->end_date);
        }

        $appointments = $query->latest('appointment_date')->get();
        
        return response()->json([
            'success' => true,
            'data' => $appointments,
        ]);
    }

    /**
     * Get upcoming appointments.
     */
    public function upcoming(Request $request): JsonResponse
    {
        $appointments = Appointment::with(['customer', 'service', 'user'])
            ->where('user_id', $request->user()->id)
            ->where('appointment_date', '>=', now())
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('appointment_date', 'asc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $appointments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'customer_id' => ['required', 'integer', 'exists:customers,id'],
                'service_id' => ['required', 'integer', 'exists:services,id'],
                'appointment_date' => ['required', 'date', 'after:now', 'before:' . now()->addYear()],
                'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
                'notes' => 'nullable|string|max:1000',
            ]);

            $validated['user_id'] = $request->user()->id;
            $appointment = Appointment::create($validated);
            $appointment->load(['customer', 'service', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Cita creada exitosamente',
                'data' => $appointment,
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
        $appointment = Appointment::where('user_id', $request->user()->id)
            ->with(['customer', 'service', 'user'])
            ->find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Cita no encontrada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $appointment,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $appointment = Appointment::where('user_id', $request->user()->id)->find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Cita no encontrada',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'customer_id' => ['sometimes', 'required', 'integer', 'exists:customers,id'],
                'service_id' => ['sometimes', 'required', 'integer', 'exists:services,id'],
                'user_id' => ['nullable', 'integer', 'exists:users,id'],
                'appointment_date' => ['sometimes', 'required', 'date', 'before:' . now()->addYear()],
                'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
                'notes' => 'nullable|string|max:1000',
            ]);

            $appointment->update($validated);
            $appointment->load(['customer', 'service', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Cita actualizada exitosamente',
                'data' => $appointment,
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
     * Update appointment status.
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $appointment = Appointment::where('user_id', $request->user()->id)->find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Cita no encontrada',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'status' => 'required|in:pending,confirmed,cancelled,completed',
            ]);

            $appointment->update($validated);
            $appointment->load(['customer', 'service', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Estado de la cita actualizado exitosamente',
                'data' => $appointment,
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
        $appointment = Appointment::where('user_id', $request->user()->id)->find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Cita no encontrada',
            ], 404);
        }

        $appointment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cita eliminada exitosamente',
        ]);
    }
}
