<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Verifica que el usuario autenticado tenga uno de los roles permitidos.
     * Uso en rutas: middleware('role:admin,business_owner')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para realizar esta acción.',
            ], 403);
        }

        return $next($request);
    }
}
