# AGENDO - Configuración de Desarrollo

## 🚀 Inicio Rápido

### Requisitos Previos
- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL

### Instalación

1. **Instalar dependencias del backend (Laravel)**
```bash
cd backend/backend
composer install
cp .env.example .env
php artisan key:generate
```

2. **Configurar base de datos**
Edita el archivo `backend/backend/.env` con tus credenciales de MySQL:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=agendo
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

3. **Ejecutar migraciones**
```bash
cd backend/backend
php artisan migrate
```

4. **Instalar dependencias de frontend y backend**
```bash
# Desde la raíz del proyecto
npm run install:all
```

### Desarrollo

#### Opción 1: Ejecutar todo desde la raíz (Recomendado)
```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará:
- ✅ Backend Laravel en `http://localhost:8000`
- ✅ Frontend React en `http://localhost:5174`

#### Opción 2: Ejecutar manualmente cada servidor

**Terminal 1 - Backend Laravel:**
```bash
cd backend/backend
php artisan serve
```

**Terminal 2 - Frontend React:**
```bash
cd frontend
npm run dev
```

### URLs de Desarrollo

- **Frontend React:** http://localhost:5174
- **Backend Laravel:** http://localhost:8000
- **API Health Check:** http://localhost:8000/api/health

### Estructura del Proyecto

```
AGENDO/
├── backend/
│   └── backend/          # Aplicación Laravel
│       ├── app/
│       ├── routes/
│       │   ├── api.php   # Rutas de la API
│       │   └── web.php   # Rutas web
│       ├── config/
│       │   └── cors.php  # Configuración CORS
│       └── ...
├── frontend/             # Aplicación React + Vite
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env              # Variables de entorno
│   └── vite.config.ts    # Configuración Vite
├── package.json          # Scripts del proyecto raíz
└── README-SETUP.md       # Este archivo
```

### Scripts Disponibles

**Desde la raíz del proyecto:**
- `npm run dev` - Inicia backend y frontend simultáneamente
- `npm run dev:backend` - Solo backend Laravel
- `npm run dev:frontend` - Solo frontend React
- `npm run install:all` - Instala todas las dependencias
- `npm run build:frontend` - Compila el frontend para producción

**Desde backend/backend:**
- `npm run dev` - Inicia Vite para Laravel
- `npm run serve` - Inicia servidor PHP
- `php artisan serve` - Servidor de desarrollo Laravel

**Desde frontend:**
- `npm run dev` - Inicia servidor de desarrollo Vite
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza la build de producción

### Configuración CORS

El backend ya está configurado para aceptar peticiones desde:
- `http://localhost:5174` (Frontend React)
- `http://localhost:5173` (Laravel Vite)

Si necesitas agregar más orígenes, edita `backend/backend/config/cors.php`.

### Verificar la Conexión

1. Inicia ambos servidores con `npm run dev`
2. Abre el navegador en `http://localhost:5174`
3. Deberías ver un indicador verde que dice "✅ Conectado"

### Troubleshooting

**Error: Puerto 8000 en uso**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process
```

**Error: CORS**
- Verifica que `backend/backend/config/cors.php` incluya la URL del frontend
- Asegúrate de que las rutas API estén en `routes/api.php`

**Error: Cannot GET /api/health**
- Verifica que `routes/api.php` exista
- Confirma que `bootstrap/app.php` tenga configurada la ruta API

### Próximos Pasos

1. Configurar autenticación con Laravel Sanctum
2. Crear módulos de gestión de citas
3. Integrar Twilio para notificaciones SMS
4. Conectar con Google Calendar API

---

**Equipo AGENDO** 🎯
