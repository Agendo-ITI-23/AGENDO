<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\AppointmentController;

// Ruta de health check para verificar que la API está funcionando
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API Laravel funcionando correctamente',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Rutas públicas
Route::prefix('public')->group(function () {
    // Servicios activos (para vista pública)
    Route::get('/services', [ServiceController::class, 'active']);
});

// Rutas del CRUD de Clientes
Route::apiResource('customers', CustomerController::class);

// Rutas del CRUD de Servicios
Route::apiResource('services', ServiceController::class);

// Rutas del CRUD de Citas
Route::apiResource('appointments', AppointmentController::class);

// Rutas adicionales para citas
Route::prefix('appointments')->group(function () {
    Route::get('/upcoming/list', [AppointmentController::class, 'upcoming']);
    Route::patch('/{id}/status', [AppointmentController::class, 'updateStatus']);
});

// Ruta de prueba que requiere autenticación (ejemplo)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
