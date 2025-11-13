# Validaciones y Auditoría - AGENDO

## 📋 Implementación Completada

### 1. Soft Deletes (Eliminación Suave)

Se ha implementado **soft delete** en todos los modelos principales para mejorar la auditoría del sistema.

#### Modelos Actualizados:
- ✅ **Customer** (Clientes)
- ✅ **Service** (Servicios)
- ✅ **Appointment** (Citas)

#### Características:
- Columna `deleted_at` agregada a las tablas
- Los registros eliminados se marcan con timestamp en lugar de eliminarse físicamente
- Permite recuperar datos eliminados accidentalmente
- Mejora la auditoría y trazabilidad del sistema
- Consultas automáticas excluyen registros eliminados

#### Migraciones Creadas:
```
2025_11_13_055623_add_soft_deletes_to_customers_table.php
2025_11_13_055634_add_soft_deletes_to_services_table.php
2025_11_13_055657_add_soft_deletes_to_appointments_table.php
```

---

## 🔒 Validaciones Backend (Laravel)

### CustomerController

#### Validaciones de Creación y Actualización:

**Nombre:**
- ✅ Requerido
- ✅ Solo letras y espacios (soporte Unicode para acentos)
- ✅ Máximo 255 caracteres
- Expresión regular: `/^[\p{L}\s]+$/u`

**Email:**
- ✅ Requerido
- ✅ Formato válido (RFC + DNS)
- ✅ Único en la base de datos
- ✅ Máximo 255 caracteres

**Teléfono:**
- ✅ Requerido
- ✅ Solo números, espacios, guiones, paréntesis y símbolo +
- ✅ Mínimo 10 dígitos
- ✅ Máximo 20 caracteres
- Expresión regular: `/^[0-9\s\-\+\(\)]+$/`

**Dirección:**
- ✅ Opcional
- ✅ Máximo 500 caracteres

---

### ServiceController

#### Validaciones de Creación y Actualización:

**Nombre:**
- ✅ Requerido
- ✅ Solo letras, números y espacios
- ✅ Máximo 255 caracteres
- Expresión regular: `/^[\p{L}\s\d]+$/u`

**Descripción:**
- ✅ Opcional
- ✅ Máximo 1000 caracteres

**Precio:**
- ✅ Requerido
- ✅ Número positivo
- ✅ Máximo 999,999.99
- ✅ Máximo 2 decimales
- Expresión regular: `/^\d+(\.\d{1,2})?$/`

**Duración (minutos):**
- ✅ Requerido
- ✅ Número entero
- ✅ Mínimo 1 minuto
- ✅ Máximo 1440 minutos (24 horas)

**Estado (is_active):**
- ✅ Booleano

---

### AppointmentController

#### Validaciones de Creación y Actualización:

**Customer ID:**
- ✅ Requerido
- ✅ Debe existir en tabla customers

**Service ID:**
- ✅ Requerido
- ✅ Debe existir en tabla services

**Fecha y Hora:**
- ✅ Requerida
- ✅ Debe ser futura (al crear)
- ✅ No puede exceder 1 año en el futuro
- ✅ Formato datetime válido

**Estado:**
- ✅ Valores permitidos: pending, confirmed, cancelled, completed

**Notas:**
- ✅ Opcional
- ✅ Máximo 1000 caracteres

---

### AuthController

#### Validaciones de Registro:

**Nombre:**
- ✅ Requerido
- ✅ Solo letras y espacios
- ✅ Máximo 255 caracteres
- Expresión regular: `/^[\p{L}\s]+$/u`

**Email:**
- ✅ Requerido
- ✅ Formato válido (RFC + DNS)
- ✅ Único en la base de datos
- ✅ Máximo 255 caracteres

**Contraseña:**
- ✅ Requerido
- ✅ Mínimo 8 caracteres
- ✅ Debe contener al menos:
  - Una letra mayúscula
  - Una letra minúscula
  - Un número
- ✅ Campo de confirmación debe coincidir
- Expresión regular: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/`

#### Validaciones de Login:

**Email:**
- ✅ Requerido
- ✅ Formato válido

**Contraseña:**
- ✅ Requerida

---

## 🎨 Validaciones Frontend (React + TypeScript)

### CustomerForm Component

#### Validaciones del lado del cliente:

**Nombre:**
```typescript
- Requerido
- Solo letras y espacios (Unicode)
- Máximo 255 caracteres
- Regex: /^[\p{L}\s]+$/u
```

**Email:**
```typescript
- Requerido
- Formato válido
- Máximo 255 caracteres
- Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

**Teléfono:**
```typescript
- Requerido
- Solo números, espacios, guiones, paréntesis y +
- Mínimo 10 dígitos (sin formato)
- Máximo 20 caracteres
- Regex: /^[0-9\s\-+()]+$/
```

**Dirección:**
```typescript
- Opcional
- Máximo 500 caracteres
```

---

### ServiceForm Component

#### Validaciones del lado del cliente:

**Nombre:**
```typescript
- Requerido
- Solo letras, números y espacios
- Máximo 255 caracteres
- Regex: /^[\p{L}\s\d]+$/u
```

**Descripción:**
```typescript
- Opcional
- Máximo 1000 caracteres
```

**Precio:**
```typescript
- Requerido
- Número positivo
- Máximo 999,999.99
- Máximo 2 decimales
- Regex: /^\d+(\.\d{1,2})?$/
```

**Duración:**
```typescript
- Requerido
- Número entero
- Mínimo 1 minuto
- Máximo 1440 minutos (24 horas)
```

---

### AppointmentForm Component

#### Validaciones del lado del cliente:

**Cliente:**
```typescript
- Requerido
- Debe seleccionar un cliente existente
```

**Servicio:**
```typescript
- Requerido
- Debe seleccionar un servicio existente
```

**Fecha:**
```typescript
- Requerida
- Debe ser futura
- No puede exceder 1 año en el futuro
```

**Hora:**
```typescript
- Requerida
- Formato válido HH:MM
```

**Notas:**
```typescript
- Opcional
- Máximo 1000 caracteres
```

---

### Register Component

#### Validaciones del lado del cliente:

**Nombre:**
```typescript
- Requerido
- Solo letras y espacios
- Máximo 255 caracteres
- Regex: /^[\p{L}\s]+$/u
```

**Email:**
```typescript
- Requerido
- Formato válido
- Máximo 255 caracteres
- Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

**Contraseña:**
```typescript
- Requerida
- Mínimo 8 caracteres
- Debe contener:
  * Al menos una mayúscula
  * Al menos una minúscula
  * Al menos un número
- Regex: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
```

**Confirmación de Contraseña:**
```typescript
- Debe coincidir con la contraseña
```

---

## 🔍 Beneficios de la Implementación

### Auditoría Mejorada:
1. **Soft Delete**: Todos los registros eliminados se mantienen en la base de datos con timestamp
2. **Trazabilidad**: Posibilidad de recuperar datos eliminados
3. **Historial completo**: Registro de todas las operaciones

### Seguridad de Datos:
1. **Validación doble**: Cliente y servidor
2. **Prevención de inyecciones**: Expresiones regulares robustas
3. **Formato consistente**: Validaciones uniformes en toda la aplicación

### Experiencia de Usuario:
1. **Mensajes claros**: Errores específicos por campo
2. **Validación instantánea**: Feedback inmediato antes de enviar
3. **Prevención de errores**: Validaciones del lado del cliente evitan peticiones innecesarias

### Integridad de Datos:
1. **Formato consistente**: Solo datos válidos en la base de datos
2. **Referencias válidas**: Foreign keys verificadas
3. **Límites claros**: Restricciones de longitud y formato

---

## 📊 Resumen de Expresiones Regulares

| Campo | Expresión Regular | Descripción |
|-------|------------------|-------------|
| Nombre (persona) | `/^[\p{L}\s]+$/u` | Solo letras Unicode y espacios |
| Nombre (servicio) | `/^[\p{L}\s\d]+$/u` | Letras, números y espacios |
| Email | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | Formato email básico |
| Teléfono | `/^[0-9\s\-+()]+$/` | Números y símbolos de formato |
| Precio | `/^\d+(\.\d{1,2})?$/` | Número con max 2 decimales |
| Contraseña | `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/` | Min 1 mayúscula, 1 minúscula, 1 número |

---

## 🎯 Próximos Pasos Recomendados

1. **Testing**: Crear pruebas unitarias para validaciones
2. **Logs**: Implementar logging de operaciones de eliminación
3. **Restauración**: Agregar endpoints para recuperar registros eliminados
4. **Reportes**: Dashboard de auditoría con registros eliminados
5. **Permisos**: Roles y permisos para operaciones de eliminación

---

**Fecha de implementación:** 13 de Noviembre, 2025  
**Sistema:** AGENDO - Sistema de Gestión de Citas  
**Estado:** ✅ Completado
