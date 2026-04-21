<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ClientAppointmentController extends Controller
{
    // Citas del cliente autenticado (en todos los negocios)
    public function index(Request $request): JsonResponse
    {
        $clientUser = $request->user();

        // Obtener todos los IDs de registros Customer vinculados a este usuario
        $customerIds = Customer::where('linked_user_id', $clientUser->id)->pluck('id');

        $query = Appointment::with(['service.user:id,name,business_name', 'customer'])
            ->whereIn('customer_id', $customerIds);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json([
            'success' => true,
            'data'    => $query->latest('appointment_date')->get(),
        ]);
    }

    public function upcoming(Request $request): JsonResponse
    {
        $customerIds = Customer::where('linked_user_id', $request->user()->id)->pluck('id');

        $appointments = Appointment::with(['service.user:id,name,business_name', 'customer'])
            ->whereIn('customer_id', $customerIds)
            ->where('appointment_date', '>=', now())
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('appointment_date')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $appointments,
        ]);
    }

    /**
     * El cliente reserva un servicio.
     * Si no existe un registro Customer para este negocio, se crea automáticamente.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'service_id'       => ['required', 'integer', 'exists:services,id'],
                'appointment_date' => ['required', 'date', 'after:now', 'before:' . now()->addYear()],
                'notes'            => ['nullable', 'string', 'max:1000'],
            ]);

            $clientUser = $request->user();

            // Verificar que el servicio esté activo
            $service = Service::where('id', $validated['service_id'])
                ->where('is_active', true)
                ->first();

            if (!$service) {
                return response()->json([
                    'success' => false,
                    'message' => 'El servicio no está disponible',
                ], 422);
            }

            $ownerId = $service->user_id;

            // Buscar o crear un registro Customer para este cliente bajo este business_owner
            $customer = Customer::firstOrCreate(
                [
                    'linked_user_id' => $clientUser->id,
                    'user_id'        => $ownerId,
                ],
                [
                    'name'    => $clientUser->name,
                    'email'   => $clientUser->email,
                    'phone'   => $clientUser->phone ?? '',
                    'address' => $clientUser->address,
                ]
            );

            $appointment = Appointment::create([
                'customer_id'      => $customer->id,
                'service_id'       => $service->id,
                'user_id'          => $ownerId,
                'appointment_date' => $validated['appointment_date'],
                'status'           => 'pending',
                'notes'            => $validated['notes'] ?? null,
            ]);

            $appointment->load(['service.user:id,name,business_name', 'customer']);

            return response()->json([
                'success' => true,
                'message' => 'Cita reservada exitosamente',
                'data'    => $appointment,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    // El cliente solo puede cancelar sus propias citas pendientes o confirmadas
    public function cancel(Request $request, string $id): JsonResponse
    {
        $customerIds = Customer::where('linked_user_id', $request->user()->id)->pluck('id');

        $appointment = Appointment::whereIn('customer_id', $customerIds)->find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Cita no encontrada',
            ], 404);
        }

        if (!in_array($appointment->status, ['pending', 'confirmed'])) {
            return response()->json([
                'success' => false,
                'message' => 'Solo se pueden cancelar citas pendientes o confirmadas',
            ], 422);
        }

        $appointment->update(['status' => 'cancelled']);
        $appointment->load(['service.user:id,name,business_name', 'customer']);

        return response()->json([
            'success' => true,
            'message' => 'Cita cancelada exitosamente',
            'data'    => $appointment,
        ]);
    }
}
