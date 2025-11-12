# 🚀 Guía de Inicialización AGENDO - Laravel + React + Vite

## ✅ Configuración Completada

La conexión entre Laravel (backend) y Vite + React (frontend) ha sido configurada exitosamente.

## 📋 Resumen de Cambios

### Backend (Laravel)
1. **Rutas API creadas** (`backend/backend/routes/api.php`)
   - Endpoint de health check: `GET /api/health`
   - Rutas API registradas en `bootstrap/app.php`

2. **CORS configurado** (`backend/backend/config/cors.php`)
   - Permite peticiones desde: `http://localhost:5174` y `http://localhost:5173`

3. **Vite configurado** (`backend/backend/vite.config.js`)
   - Puerto: 5173 (para recursos de Laravel)

### Frontend (React + Vite)
1. **Vite configurado** (`frontend/vite.config.ts`)
   - Puerto: 5174
   - Proxy configurado para `/api` → `http://localhost:8000`

2. **Variables de entorno** (`frontend/.env`)
   - `VITE_API_URL=http://localhost:8000`

3. **App.tsx actualizado**
   - Incluye verificación de conexión con el backend
   - Muestra estado de la API (Conectado/Desconectado)

### Raíz del Proyecto
1. **package.json creado** con scripts unificados:
   - `npm run dev` - Inicia backend y frontend simultáneamente
   - `npm run install:all` - Instala todas las dependencias

## 🎯 Cómo Iniciar el Proyecto

### Opción 1: Inicio Rápido (Recomendado)

```powershell
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará automáticamente:
- ✅ Laravel en `http://localhost:8000`
- ✅ React en `http://localhost:5174`

### Opción 2: Manual (3 terminales)

**Terminal 1 - Backend Laravel:**
```powershell
cd backend\backend
php artisan serve
```

**Terminal 2 - Frontend React:**
```powershell
cd frontend
npm run dev
```

## 🧪 Verificar que Funciona

1. Abre tu navegador en: `http://localhost:5174`
2. Deberías ver:
   - La página por defecto de Vite + React
   - Un indicador que dice **"✅ Conectado"** (verde)
   - El título "AGENDO - Vite + React + Laravel"

3. Si ves **"❌ Desconectado"** (rojo):
   - Verifica que Laravel esté corriendo en `http://localhost:8000`
   - Prueba manualmente: `http://localhost:8000/api/health`

## 📁 Estructura de Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Laravel Backend | 8000 | http://localhost:8000 |
| React Frontend | 5174 | http://localhost:5174 |
| Laravel Vite | 5173 | http://localhost:5173 |

## 🔧 Comandos Útiles

### Desde la raíz del proyecto:
```powershell
npm run dev              # Inicia todo
npm run dev:backend      # Solo backend
npm run dev:frontend     # Solo frontend
npm run install:all      # Instala dependencias
```

### Desde backend/backend:
```powershell
php artisan serve        # Servidor Laravel
php artisan migrate      # Ejecutar migraciones
php artisan route:list   # Ver todas las rutas
```

### Desde frontend:
```powershell
npm run dev              # Servidor de desarrollo
npm run build            # Compilar para producción
npm run preview          # Previsualizar build
```

## 🌐 Endpoints API Disponibles

- **Health Check:** `GET http://localhost:8000/api/health`
  ```json
  {
    "status": "ok",
    "message": "API Laravel funcionando correctamente",
    "timestamp": "2025-11-05T..."
  }
  ```

## 🔄 Flujo de Comunicación

```
Frontend (React)          Backend (Laravel)
    :5174        ──────→      :8000
                   /api/*
```

1. El frontend hace peticiones a `/api/*`
2. Vite proxy redirige a `http://localhost:8000/api/*`
3. Laravel procesa la petición
4. CORS permite la respuesta
5. Frontend recibe los datos

## ⚠️ Troubleshooting

### Puerto 8000 ya en uso
```powershell
# Encontrar y matar el proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process
```

### Error de CORS
- Verifica que `backend/backend/config/cors.php` incluya `http://localhost:5174`
- Reinicia el servidor de Laravel

### Frontend no se conecta
1. Verifica que Laravel esté corriendo: `curl http://localhost:8000/api/health`
2. Revisa el archivo `frontend/.env`
3. Verifica la consola del navegador (F12)

### Error "Cannot GET /api/..."
- Confirma que `routes/api.php` existe
- Verifica que `bootstrap/app.php` tenga `api: __DIR__.'/../routes/api.php'`

## 📝 Próximos Pasos

1. **Autenticación:** Implementar Laravel Sanctum
2. **Base de datos:** Crear modelos y migraciones para citas
3. **API REST:** Desarrollar endpoints CRUD
4. **Frontend:** Crear componentes React para gestión de citas
5. **Notificaciones:** Integrar Twilio y Google Calendar

## 🎉 ¡Listo!

Tu proyecto AGENDO está configurado y listo para desarrollo. Ejecuta `npm run dev` desde la raíz y comienza a desarrollar.

---

**Configurado por:** GitHub Copilot
**Fecha:** 2025-11-05
**Equipo:** AGENDO ITI-23
