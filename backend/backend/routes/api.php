<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Ruta de health check para verificar que la API está funcionando
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API Laravel funcionando correctamente',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Ruta de prueba que requiere autenticación (ejemplo)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
