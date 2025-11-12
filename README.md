# 🎯 AGENDO - Sistema de Gestión de Citas

<div align="center">

![Status](https://img.shields.io/badge/status-en_desarrollo-yellow)
![Laravel](https://img.shields.io/badge/Laravel-11.x-red)
![React](https://img.shields.io/badge/React-19.x-blue)
![Vite](https://img.shields.io/badge/Vite-7.x-purple)
![License](https://img.shields.io/badge/license-MIT-green)

Sistema de reservas y gestión de citas para negocios que permite programar, modificar y notificar citas a clientes y usuarios.

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Inicio Rápido](#-inicio-rápido)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación](#-documentación)
- [Equipo](#-equipo)
- [Metodologías](#-metodologías)
- [Roadmap](#-roadmap)

## 📖 Descripción

AGENDO es una aplicación web moderna diseñada para facilitar la gestión eficiente de citas y servicios. El sistema ofrece una interfaz intuitiva para la programación de citas, gestión de servicios, y automatización de recordatorios y reportes.

### Objetivo del Proyecto

Desarrollar una aplicación web robusta y escalable que simplifique el proceso de gestión de citas, mejorando la experiencia tanto de administradores como de clientes a través de:

- 📅 Programación inteligente de citas
- 📱 Notificaciones automáticas (SMS y Email)
- 📊 Reportes y análisis en tiempo real
- 👥 Gestión integral de usuarios y servicios
- 🔄 Sincronización con Google Calendar

## ✨ Características

### Funcionalidades Principales

- ✅ **Gestión de Citas**
  - Crear, modificar y cancelar citas
  - Visualización en calendario
  - Disponibilidad en tiempo real
  - Reservas online

- ✅ **Administración de Servicios**
  - Catálogo de servicios
  - Precios y duraciones
  - Categorización

- ✅ **Gestión de Usuarios**
  - Roles y permisos
  - Perfil de cliente
  - Historial de citas

- ✅ **Notificaciones Automáticas**
  - Recordatorios por SMS (Twilio)
  - Notificaciones por correo
  - Confirmaciones de citas

- ✅ **Reportes y Analytics**
  - Dashboard administrativo
  - Estadísticas de uso
  - Reportes personalizables
  - Exportación de datos

## 🚀 Tecnologías

### Backend
- **Laravel 11.x** - Framework PHP
- **MySQL** - Base de datos relacional
- **Laravel Sanctum** - Autenticación API

### Frontend
- **React 19.x** - Biblioteca de UI
- **Vite 7.x** - Build tool
- **TypeScript** - Tipado estático
- **Tailwind CSS 4.x** - Framework CSS
- **Axios** - Cliente HTTP

### APIs Externas
- **Twilio** - Envío de SMS
- **Google Calendar API** - Sincronización de calendarios

### DevOps
- **Git** - Control de versiones
- **npm** - Gestión de paquetes
- **Composer** - Gestión de dependencias PHP

## ⚡ Inicio Rápido

### Requisitos Previos

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL >= 8.0
- Git

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Agendo-ITI-23/AGENDO.git
   cd AGENDO
   ```

2. **Instalar dependencias**
   ```bash
   npm run install:all
   ```

3. **Configurar Backend**
   ```bash
   cd backend/backend
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   ```

4. **Configurar Frontend**
   ```bash
   cd frontend
   cp .env.example .env
   ```

5. **Iniciar servidores de desarrollo**
   
   **Opción 1 - Terminales separadas (Recomendado para Windows):**
   ```bash
   # Terminal 1 - Backend
   cd backend/backend
   php artisan serve

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

   **Opción 2 - Comando unificado:**
   ```bash
   npm run dev
   ```

6. **Acceder a la aplicación**
   - Frontend: http://localhost:5174
   - Backend: http://localhost:8000
   - API Health: http://localhost:8000/api/health

## 📁 Estructura del Proyecto

```
AGENDO/
├── backend/
│   └── backend/          # Aplicación Laravel
│       ├── app/          # Lógica de aplicación
│       ├── config/       # Configuraciones
│       ├── database/     # Migraciones y seeders
│       ├── routes/       # Rutas API y Web
│       └── ...
├── frontend/             # Aplicación React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── services/     # Servicios API
│   │   └── ...
│   └── ...
├── docs/                 # Documentación del proyecto
│   ├── README-SETUP.md
│   ├── INICIALIZACION.md
│   ├── INICIO-WINDOWS.md
│   ├── RESUMEN-CONFIG.md
│   └── plan.md
├── .gitignore           # Archivos ignorados por Git
├── package.json         # Scripts del proyecto
└── README.md            # Este archivo
```

## 📚 Documentación

La documentación completa del proyecto está disponible en la carpeta `docs/`:

### Guías de Configuración
- 📘 **[README-SETUP.md](docs/README-SETUP.md)** - Guía completa de configuración e instalación
- 🚀 **[INICIALIZACION.md](docs/INICIALIZACION.md)** - Guía de inicialización del proyecto
- 🪟 **[INICIO-WINDOWS.md](docs/INICIO-WINDOWS.md)** - Instrucciones específicas para Windows
- ✅ **[RESUMEN-CONFIG.md](docs/RESUMEN-CONFIG.md)** - Resumen de la configuración actual

### Planificación
- 📋 **[plan.md](docs/plan.md)** - Plan del proyecto y roadmap

### Recursos Adicionales
- [Documentación de Laravel](https://laravel.com/docs)
- [Documentación de React](https://react.dev)
- [Documentación de Vite](https://vitejs.dev)
- [API de Twilio](https://www.twilio.com/docs)
- [Google Calendar API](https://developers.google.com/calendar)

## 👥 Equipo

### Equipo de Trabajo y Roles

| Rol | Nombre | Responsabilidades |
|-----|--------|-------------------|
| **Product Owner** | Rodrigo Silva Flores | Visión del producto, priorización de backlog |
| **Scrum Master** | Ana Paola Escobedo Colunga | Facilitación, proceso Scrum |
| **Developer** | Omar Villarreal Castro | Desarrollo full-stack |
| **Developer** | Martín Roel Rivera Sánchez | Desarrollo full-stack |

## 🔄 Metodologías

### Gestión de Proyecto
- **Scrum** - Framework ágil para gestión del proyecto
  - Sprints de 2 semanas
  - Daily standups
  - Sprint planning y retrospectivas

- **Kanban** - Flujo visual de actividades
  - Board de tareas
  - WIP limits
  - Visualización del progreso

### Desarrollo
- **Git Flow** - Estrategia de branching
- **Code Review** - Revisión de código por pares
- **Testing** - Pruebas unitarias e integración
- **CI/CD** - Integración y despliegue continuo

## 🗺️ Roadmap

### Fase 1: MVP (En Desarrollo) ✅
- [x] Configuración inicial del proyecto
- [x] Estructura backend y frontend
- [x] Conexión Laravel + React
- [ ] Sistema de autenticación
- [ ] CRUD básico de citas
- [ ] CRUD de servicios

### Fase 2: Funcionalidades Core
- [ ] Calendario interactivo
- [ ] Sistema de notificaciones
- [ ] Dashboard administrativo
- [ ] Gestión de usuarios avanzada

### Fase 3: Integraciones
- [ ] Integración con Twilio (SMS)
- [ ] Integración con Google Calendar
- [ ] Sistema de reportes
- [ ] Exportación de datos

### Fase 4: Mejoras y Optimización
- [ ] Optimización de rendimiento
- [ ] PWA (Progressive Web App)
- [ ] Multi-idioma
- [ ] Modo oscuro

## 🛠️ Scripts Disponibles

### Desde la raíz del proyecto
```bash
npm run dev              # Iniciar backend y frontend
npm run dev:backend      # Solo backend Laravel
npm run dev:frontend     # Solo frontend React
npm run install:all      # Instalar todas las dependencias
npm run build:frontend   # Compilar frontend para producción
```

### Backend (Laravel)
```bash
php artisan serve        # Iniciar servidor
php artisan migrate      # Ejecutar migraciones
php artisan db:seed      # Ejecutar seeders
php artisan test         # Ejecutar pruebas
```

### Frontend (React)
```bash
npm run dev              # Servidor de desarrollo
npm run build            # Compilar para producción
npm run preview          # Previsualizar build
npm run lint             # Linter
```

## 🤝 Contribución

Este es un proyecto académico del ITI-23. Para contribuir:

1. Crea un branch desde `main`
2. Realiza tus cambios
3. Asegúrate de que las pruebas pasen
4. Envía un Pull Request
5. Espera la revisión del equipo

## 📄 Licencia

Este proyecto es parte del curso ITI-23 y es solo para fines educativos.

## 📞 Contacto

Para más información sobre el proyecto, contacta al equipo:
- Product Owner: Rodrigo Silva Flores
- Scrum Master: Ana Paola Escobedo Colunga

---

<div align="center">

**🎯 AGENDO** - Sistema de Gestión de Citas

Hecho con ❤️ por el equipo ITI-23

</div>
