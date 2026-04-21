<?php

use App\Http\Controllers\Api\AuthController;

// Controladores existentes (admin + business_owner)
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\AppointmentController;

// Admin
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\AdminCustomerController;
use App\Http\Controllers\Api\Admin\AdminServiceController;
use App\Http\Controllers\Api\Admin\AdminAppointmentController;

// Owner
use App\Http\Controllers\Api\Owner\OwnerServiceController;
use App\Http\Controllers\Api\Owner\OwnerAppointmentController;
use App\Http\Controllers\Api\Owner\OwnerCustomerController;

// Client
use App\Http\Controllers\Api\Client\ClientProfileController;
use App\Http\Controllers\Api\Client\ClientServiceController;
use App\Http\Controllers\Api\Client\ClientAppointmentController;

// ─────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────
Route::get('/health', function () {
    return response()->json([
        'status'    => 'ok',
        'message'   => 'API Laravel funcionando correctamente',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// ─────────────────────────────────────────────
// Autenticación (pública)
// ─────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ─────────────────────────────────────────────
// Datos públicos (sin autenticación)
// ─────────────────────────────────────────────
Route::prefix('public')->group(function () {
    Route::get('/services',      [ClientServiceController::class, 'index']);
    Route::get('/services/{id}', [ClientServiceController::class, 'show']);
});

// ─────────────────────────────────────────────
// Rutas protegidas (requieren token)
// ─────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth: logout y usuario actual
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user',    [AuthController::class, 'user']);
    });

    // ── ADMIN ──────────────────────────────────
    // Vista global: sin filtro por user_id
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        // Gestión de usuarios
        Route::apiResource('users', AdminUserController::class)->except(['store']);

        // Vista global de datos
        Route::get('customers',                                      [AdminCustomerController::class, 'index']);
        Route::get('customers/{id}',                                 [AdminCustomerController::class, 'show']);
        Route::patch('customers/{id}',                               [AdminCustomerController::class, 'update']);
        Route::delete('customers/{id}',                              [AdminCustomerController::class, 'destroy']);

        Route::get('services',                                       [AdminServiceController::class, 'index']);
        Route::get('services/{id}',                                  [AdminServiceController::class, 'show']);
        Route::patch('services/{id}',                                [AdminServiceController::class, 'update']);
        Route::delete('services/{id}',                               [AdminServiceController::class, 'destroy']);

        Route::get('appointments',                                   [AdminAppointmentController::class, 'index']);
        Route::get('appointments/upcoming',                          [AdminAppointmentController::class, 'upcoming']);
        Route::get('appointments/{id}',                              [AdminAppointmentController::class, 'show']);
        Route::patch('appointments/{id}/status',                     [AdminAppointmentController::class, 'updateStatus']);
        Route::delete('appointments/{id}',                           [AdminAppointmentController::class, 'destroy']);
    });

    // ── BUSINESS OWNER ─────────────────────────
    // Vista propia: filtrada por user_id del owner
    Route::prefix('owner')->middleware('role:business_owner')->group(function () {
        Route::apiResource('services', OwnerServiceController::class);

        Route::get('appointments/upcoming',      [OwnerAppointmentController::class, 'upcoming']);
        Route::patch('appointments/{id}/status', [OwnerAppointmentController::class, 'updateStatus']);
        Route::apiResource('appointments', OwnerAppointmentController::class)->except(['store']);

        Route::apiResource('customers', OwnerCustomerController::class);
    });

    // ── CLIENTE ────────────────────────────────
    // Vista propia: filtrada por linked_user_id
    Route::prefix('client')->middleware('role:customer')->group(function () {
        Route::get('/profile',   [ClientProfileController::class, 'show']);
        Route::patch('/profile', [ClientProfileController::class, 'update']);

        Route::get('/services',      [ClientServiceController::class, 'index']);
        Route::get('/services/{id}', [ClientServiceController::class, 'show']);

        Route::get('/appointments',                   [ClientAppointmentController::class, 'index']);
        Route::get('/appointments/upcoming',          [ClientAppointmentController::class, 'upcoming']);
        Route::post('/appointments',                  [ClientAppointmentController::class, 'store']);
        Route::patch('/appointments/{id}/cancel',     [ClientAppointmentController::class, 'cancel']);
    });

    // ── RUTAS LEGACY (admin + business_owner) ──
    // Mantienen compatibilidad con el frontend actual mientras se migra.
    // El admin aquí ve solo sus propios datos (usa user_id filter).
    Route::middleware('role:admin,business_owner')->group(function () {
        Route::apiResource('customers', CustomerController::class);
        Route::apiResource('services',  ServiceController::class);

        Route::get('appointments/upcoming',      [AppointmentController::class, 'upcoming']);
        Route::patch('appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
        Route::apiResource('appointments', AppointmentController::class);
    });
});
