# 🪟 Guía de Inicio para Windows - AGENDO

## ⚡ Inicio Rápido (3 Comandos en Terminales Separadas)

### Terminal 1: Backend Laravel
```powershell
cd backend\backend
php artisan serve
```
✅ Verás: `Server running on [http://127.0.0.1:8000]`

### Terminal 2: Frontend React
```powershell
cd frontend
npm run dev
```
✅ Verás: `Local: http://localhost:5174/`

### Terminal 3: Laravel Vite (Opcional - solo si usas recursos de Laravel)
```powershell
cd backend\backend
npm run dev
```

## 🌐 Abrir en el Navegador

Una vez que ambos servidores estén corriendo, abre:
- **Frontend:** http://localhost:5174
- **Verifica el indicador:** Debe decir "✅ Conectado" en verde

## 📌 Comandos Rápidos

### Para Detener los Servidores
Presiona `Ctrl + C` en cada terminal

### Para Verificar que el Backend Funciona
```powershell
# En PowerShell o en tu navegador
Invoke-WebRequest http://localhost:8000/api/health | Select-Object -Expand Content
```

### Para Verificar Puertos en Uso
```powershell
# Ver qué proceso usa el puerto 8000
Get-NetTCPConnection -LocalPort 8000 | Select-Object State, OwningProcess

# Ver qué proceso usa el puerto 5174
Get-NetTCPConnection -LocalPort 5174 | Select-Object State, OwningProcess
```

### Para Liberar un Puerto
```powershell
# Ejemplo: Liberar puerto 8000
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process
```

## 🎯 Verificación Rápida

1. **Backend funcionando:**
   ```powershell
   curl http://localhost:8000/api/health
   ```
   Deberías ver: `{"status":"ok","message":"API Laravel funcionando correctamente",...}`

2. **Frontend funcionando:**
   Abre http://localhost:5174 en tu navegador
   - Deberías ver la página de Vite + React
   - El indicador debe estar verde: "✅ Conectado"

## 🐛 Solución de Problemas

### "No es posible conectar con el servidor remoto"
- El backend no está corriendo
- Inicia el servidor Laravel: `cd backend\backend; php artisan serve`

### "Este sitio no se puede alcanzar"
- El frontend no está corriendo
- Inicia Vite: `cd frontend; npm run dev`

### Puerto ya en uso
```powershell
# Encuentra y detén el proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process
```

## 📋 Checklist de Inicio

- [ ] ¿Instalaste las dependencias? (`npm run install:all` desde la raíz)
- [ ] ¿Configuraste el .env de Laravel? (`backend\backend\.env`)
- [ ] ¿Ejecutaste las migraciones? (`php artisan migrate`)
- [ ] ¿El backend está corriendo en puerto 8000?
- [ ] ¿El frontend está corriendo en puerto 5174?
- [ ] ¿El navegador muestra "✅ Conectado"?

## 💡 Tip: Usar Windows Terminal

Para una mejor experiencia, usa **Windows Terminal** y abre múltiples pestañas:

1. Abre Windows Terminal
2. Pestaña 1: Backend → `cd backend\backend; php artisan serve`
3. Nueva pestaña (Ctrl+Shift+T): Frontend → `cd frontend; npm run dev`

---

**¡Listo para desarrollar! 🚀**
