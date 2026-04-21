<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminAppointmentController extends Controller
{
    // Admin ve TODAS las citas de todos los business_owners
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['customer', 'service', 'user:id,name,email,business_name']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('start_date')) {
            $query->whereDate('appointment_date', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('appointment_date', '<=', $request->end_date);
        }
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        return response()->json([
            'success' => true,
            'data'    => $query->latest('appointment_date')->get(),
        ]);
    }

    public function upcoming(): JsonResponse
    {
        $appointments = Appointment::with(['customer', 'service', 'user:id,name,email,business_name'])
            ->where('appointment_date', '>=', now())
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('appointment_date')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $appointments,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $appointment = Appointment::with(['customer', 'service', 'user:id,name,email,business_name'])
            ->find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Cita no encontrada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $appointment,
        ]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $appointment = Appointment::find($id);

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
                'data'    => $appointment,
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
        $appointment = Appointment::find($id);

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
