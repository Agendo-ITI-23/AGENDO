<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;

// Ruta de health check para verificar que la API está funcionando
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API Laravel funcionando correctamente',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Rutas de autenticación (públicas)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Rutas públicas
Route::prefix('public')->group(function () {
    // Servicios activos (para vista pública)
    Route::get('/services', [ServiceController::class, 'active']);
});

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
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
});
