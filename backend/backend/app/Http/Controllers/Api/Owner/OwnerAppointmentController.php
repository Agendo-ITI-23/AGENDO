<?php

namespace App\Http\Controllers\Api\Owner;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class OwnerAppointmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['customer', 'service'])
            ->where('user_id', $request->user()->id);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('start_date')) {
            $query->whereDate('appointment_date', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('appointment_date', '<=', $request->end_date);
        }

        return response()->json([
            'success' => true,
            'data'    => $query->latest('appointment_date')->get(),
        ]);
    }

    public function upcoming(Request $request): JsonResponse
    {
        $appointments = Appointment::with(['customer', 'service'])
            ->where('user_id', $request->user()->id)
            ->where('appointment_date', '>=', now())
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('appointment_date')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $appointments,
        ]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $appointment = Appointment::where('user_id', $request->user()->id)
            ->with(['customer', 'service'])
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
            $appointment->load(['customer', 'service']);

            return response()->json([
                'success' => true,
                'message' => 'Estado actualizado exitosamente',
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
