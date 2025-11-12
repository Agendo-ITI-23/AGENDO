# 📚 Documentación AGENDO

Bienvenido a la documentación del proyecto AGENDO. Aquí encontrarás todas las guías necesarias para configurar, desarrollar y mantener el sistema.

## 📑 Índice de Documentación

### 🚀 Guías de Inicio

#### [README-SETUP.md](README-SETUP.md)
**Configuración Completa del Proyecto**

Guía detallada paso a paso para configurar el proyecto desde cero:
- Requisitos previos
- Instalación de dependencias
- Configuración de base de datos
- Variables de entorno
- Troubleshooting común

**Ideal para:** Primera instalación del proyecto

---

#### [INICIALIZACION.md](INICIALIZACION.md)
**Guía de Inicialización**

Documento completo sobre cómo inicializar y ejecutar el proyecto:
- Resumen de cambios realizados
- Configuración de Backend (Laravel)
- Configuración de Frontend (React + Vite)
- Flujo de comunicación entre servicios
- Endpoints API disponibles

**Ideal para:** Entender la arquitectura del proyecto

---

#### [INICIO-WINDOWS.md](INICIO-WINDOWS.md)
**Guía Específica para Windows**

Instrucciones optimizadas para desarrollo en Windows:
- Inicio rápido con PowerShell
- Comandos específicos de Windows
- Solución de problemas comunes en Windows
- Gestión de puertos
- Checklist de inicio

**Ideal para:** Desarrolladores en Windows

---

#### [RESUMEN-CONFIG.md](RESUMEN-CONFIG.md)
**Resumen de Configuración Actual**

Estado actual del proyecto y configuraciones implementadas:
- Estado de servicios (Backend/Frontend)
- Archivos creados y modificados
- URLs importantes
- Pruebas realizadas
- Endpoints API disponibles
- Configuraciones clave (CORS, Proxy, Variables)
- Próximos pasos sugeridos

**Ideal para:** Verificación rápida del estado del proyecto

---

### 📋 Planificación

#### [plan.md](plan.md)
**Plan del Proyecto**

Documento de planificación original del proyecto:
- Objetivos
- Alcance
- Cronograma
- Requerimientos
- Módulos planificados

**Ideal para:** Entender el alcance y visión del proyecto

---

## 🗂️ Organización de la Documentación

```
docs/
├── README.md               # Este archivo (índice)
├── README-SETUP.md         # Configuración completa
├── INICIALIZACION.md       # Guía de inicialización
├── INICIO-WINDOWS.md       # Guía para Windows
├── RESUMEN-CONFIG.md       # Estado actual
└── plan.md                 # Plan del proyecto
```

## 🎯 Flujo Recomendado de Lectura

### Para Nuevos Desarrolladores

1. **Primero:** Lee [README-SETUP.md](README-SETUP.md)
   - Configura tu entorno
   - Instala dependencias
   - Crea tu base de datos

2. **Segundo:** Revisa [INICIALIZACION.md](INICIALIZACION.md)
   - Entiende la arquitectura
   - Conoce los endpoints
   - Aprende el flujo de datos

3. **Tercero (Si usas Windows):** Consulta [INICIO-WINDOWS.md](INICIO-WINDOWS.md)
   - Comandos específicos
   - Troubleshooting de Windows
   - Tips y trucos

4. **Cuarto:** Verifica con [RESUMEN-CONFIG.md](RESUMEN-CONFIG.md)
   - Confirma que todo funciona
   - Revisa las configuraciones
   - Ejecuta las pruebas

### Para Revisión Rápida

- ¿Necesitas iniciar el proyecto? → [INICIO-WINDOWS.md](INICIO-WINDOWS.md) o [INICIALIZACION.md](INICIALIZACION.md)
- ¿Problemas de configuración? → [README-SETUP.md](README-SETUP.md)
- ¿Verificar estado actual? → [RESUMEN-CONFIG.md](RESUMEN-CONFIG.md)
- ¿Entender el plan? → [plan.md](plan.md)

## 🔗 Enlaces Rápidos

### Desarrollo Local
- **Frontend:** http://localhost:5174
- **Backend:** http://localhost:8000
- **API Health Check:** http://localhost:8000/api/health

### Comandos Rápidos

```bash
# Iniciar todo (desde la raíz)
npm run dev

# Backend solo
cd backend/backend && php artisan serve

# Frontend solo
cd frontend && npm run dev
```

## 📝 Convenciones de Documentación

### Iconos Utilizados
- 📚 Documentación general
- 🚀 Guías de inicio/configuración
- 📋 Planificación/organización
- ⚡ Comandos rápidos
- 🐛 Troubleshooting
- ✅ Estado/verificación
- 🪟 Específico de Windows
- 🐧 Específico de Linux
- 🍎 Específico de macOS
- 🔗 Enlaces externos
- 💡 Tips y trucos
- ⚠️ Advertencias
- 🎯 Objetivos/metas

### Formato de Código

Los bloques de código están identificados por lenguaje:

```bash
# Comandos de terminal
```

```php
// Código PHP/Laravel
```

```typescript
// Código TypeScript/React
```

```json
// Configuraciones JSON
```

## 🆘 Necesitas Ayuda?

### Problemas Comunes

1. **Puertos en uso**
   - Ver: [INICIO-WINDOWS.md - Solución de Problemas](INICIO-WINDOWS.md#-solución-de-problemas)

2. **Error de CORS**
   - Ver: [RESUMEN-CONFIG.md - Troubleshooting](RESUMEN-CONFIG.md#-troubleshooting)

3. **Backend no conecta**
   - Ver: [README-SETUP.md - Configuración Backend](README-SETUP.md#backend-laravel)

4. **Dependencias faltantes**
   - Ver: [README-SETUP.md - Instalación](README-SETUP.md#instalación)

### Recursos Adicionales

- [Documentación de Laravel](https://laravel.com/docs)
- [Documentación de React](https://react.dev)
- [Documentación de Vite](https://vitejs.dev)
- [Guía de TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🔄 Actualizaciones

Este índice se actualiza conforme se agrega nueva documentación al proyecto.

**Última actualización:** 2025-11-12

---

## 📞 Contacto del Equipo

Para preguntas sobre la documentación:
- **Product Owner:** Rodrigo Silva Flores
- **Scrum Master:** Ana Paola Escobedo Colunga
- **Developers:** Omar Villarreal Castro, Martín Roel Rivera Sánchez

---

<div align="center">

**Volver al [README principal](../README.md)**

</div>
