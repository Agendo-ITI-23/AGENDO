<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ClientServiceController extends Controller
{
    // Lista todos los servicios activos de todos los business_owners (con info del negocio)
    public function index(): JsonResponse
    {
        $services = Service::where('is_active', true)
            ->with('user:id,name,business_name,business_description')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $services,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $service = Service::where('is_active', true)
            ->with('user:id,name,business_name,business_description,phone')
            ->find($id);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Servicio no encontrado o no disponible',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $service,
        ]);
    }
}
