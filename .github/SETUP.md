# GitHub Pages Deployment Configuration

## 🌐 URL del Sitio Desplegado

Una vez configurado, tu sitio estará disponible en:
```
https://Agendo-ITI-23.github.io/AGENDO/
```

## 📋 Instrucciones de Configuración

### Paso 1: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona **GitHub Actions**
5. Guarda los cambios

### Paso 2: Configurar el Backend API

Tienes dos opciones:

#### Opción A: Usar GitHub Secrets (Recomendado)

1. Ve a **Settings** > **Secrets and variables** > **Actions**
2. Click en **New repository secret**
3. Crea un nuevo secret:
   - **Name**: `VITE_API_URL`
   - **Value**: La URL completa de tu API backend
   - Ejemplo: `https://tu-api-backend.com`

#### Opción B: Archivo .env.production

Crea el archivo `frontend/.env.production`:
```env
VITE_API_URL=https://tu-api-backend.com
```

> ⚠️ **Importante**: Si usas esta opción, NO comitees este archivo si contiene información sensible.

### Paso 3: Configurar CORS en el Backend

Tu backend debe permitir requests desde GitHub Pages. Agrega a tu configuración CORS:

```php
// backend/config/cors.php
'allowed_origins' => [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://agendo-iti-23.github.io', // ← Agregar esta línea
],
```

### Paso 4: Deploy

El deploy se ejecuta automáticamente al hacer push a `main`:

```bash
git add .
git commit -m "Configurar deploy a GitHub Pages"
git push origin main
```

O ejecuta el workflow manualmente:
1. Ve a **Actions**
2. Selecciona **Deploy to GitHub Pages**
3. Click en **Run workflow**

## 🔧 Archivos Creados

```
AGENDO/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml          # Workflow de GitHub Actions
│   └── DEPLOY.md               # Esta guía
├── frontend/
│   ├── public/
│   │   └── .nojekyll           # Previene procesamiento Jekyll
│   └── vite.config.ts          # Configuración actualizada con base path
```

## 📝 Cambios Realizados

### 1. Workflow de GitHub Actions (`.github/workflows/deploy.yml`)
- Build automático del frontend
- Deploy a GitHub Pages
- Usa Node.js 20
- Cachea dependencias npm

### 2. Vite Config (`frontend/vite.config.ts`)
- `base: '/AGENDO/'` para producción
- Configuración de build optimizada

### 3. Archivo `.nojekyll`
- Previene que GitHub Pages procese archivos con Jekyll
- Permite que archivos que comienzan con `_` se sirvan correctamente

## 🚀 Verificar el Deploy

1. **Monitorear el Workflow**:
   - Ve a la pestaña **Actions**
   - Observa el progreso del workflow
   - El proceso toma ~2-5 minutos

2. **Acceder al Sitio**:
   - URL: `https://Agendo-ITI-23.github.io/AGENDO/`
   - Puede tardar unos minutos en propagarse

3. **Revisar Logs**:
   - Si hay errores, revisa los logs en Actions
   - Verifica la consola del navegador para errores de API

## ⚙️ Configuración de Producción vs Desarrollo

| Entorno | Base URL | API URL |
|---------|----------|---------|
| Desarrollo | `/` | `http://localhost:8000` (via proxy) |
| Producción | `/AGENDO/` | Desde `VITE_API_URL` secret/env |

## 🐛 Solución de Problemas

### Error: "404 Page not found"
- Verifica que GitHub Pages esté configurado para usar **GitHub Actions**
- Confirma que el workflow se completó exitosamente

### Error: "API request failed"
- Verifica que `VITE_API_URL` esté configurado
- Confirma que el backend tenga CORS habilitado para GitHub Pages
- Revisa la consola del navegador (F12)

### El deploy falla en GitHub Actions
- Revisa los logs detallados en la pestaña Actions
- Verifica que `npm run build` funcione localmente:
  ```bash
  cd frontend
  npm install
  npm run build
  ```

### Los assets no cargan (404)
- Verifica que el `base` en `vite.config.ts` sea `/AGENDO/`
- Confirma que `.nojekyll` exista en `frontend/public/`

## 📦 Build Manual Local

Para probar el build de producción localmente:

```bash
cd frontend

# Build
npm run build

# Preview (simula producción)
npm run preview
```

## 🔄 Actualizar el Sitio

Cualquier push a `main` actualiza automáticamente el sitio:

```bash
# Hacer cambios
git add .
git commit -m "Actualización"
git push origin main

# El sitio se actualizará en ~2-5 minutos
```

## 📚 Recursos Adicionales

- [Documentación de Vite para Deploy](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Pages con GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)
- [Variables de Entorno en Vite](https://vitejs.dev/guide/env-and-mode.html)

---

**Estado**: ✅ Configuración completa. Listo para deploy.
