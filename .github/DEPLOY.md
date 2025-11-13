# Deploy a GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages.

## 🚀 Configuración Inicial

### 1. Habilitar GitHub Pages en el Repositorio

1. Ve a **Settings** > **Pages** en tu repositorio
2. En **Source**, selecciona **GitHub Actions**
3. Guarda los cambios

### 2. Configurar Variables de Entorno (Secrets)

Necesitas configurar la URL de tu API backend:

1. Ve a **Settings** > **Secrets and variables** > **Actions**
2. Click en **New repository secret**
3. Agrega el siguiente secret:
   - **Name**: `VITE_API_URL`
   - **Value**: URL de tu API backend (ej: `https://tu-backend.com`)

## 📦 Proceso de Deploy Automático

El deploy se ejecuta automáticamente cuando:
- Haces push a la rama `main`
- Ejecutas manualmente el workflow desde GitHub Actions

### Workflow (`deploy.yml`)

El workflow hace lo siguiente:

1. **Build Job**:
   - Checkout del código
   - Instala Node.js 20
   - Instala dependencias (`npm ci`)
   - Construye el proyecto (`npm run build`)
   - Sube el artefact generado

2. **Deploy Job**:
   - Despliega el artefact a GitHub Pages
   - La URL estará disponible en: `https://[usuario].github.io/AGENDO/`

## 🛠️ Deploy Manual

Si necesitas hacer un deploy manual:

1. Ve a **Actions** en tu repositorio
2. Selecciona el workflow **Deploy to GitHub Pages**
3. Click en **Run workflow**
4. Selecciona la rama `main` y confirma

## 📝 Configuración del Proyecto

### Base Path

El proyecto está configurado para usar `/AGENDO/` como base path en producción:

```typescript
base: process.env.NODE_ENV === 'production' ? '/AGENDO/' : '/'
```

Si tu repositorio tiene un nombre diferente, actualiza el `base` en `frontend/vite.config.ts`.

### API URL

En desarrollo, la API se accede a través del proxy configurado en Vite:
- Desarrollo: `http://localhost:8000/api`
- Producción: Se usa la URL configurada en `VITE_API_URL`

Para configurar la API en producción, crea un archivo `.env.production` en `frontend/`:

```env
VITE_API_URL=https://tu-backend.com
```

O configúralo como secret en GitHub Actions (recomendado).

## 🔍 Verificar el Deploy

Después de un push exitoso:

1. Ve a **Actions** y verifica que el workflow se completó
2. Accede a tu sitio en: `https://[usuario].github.io/AGENDO/`
3. Verifica que la aplicación carga correctamente

## ⚠️ Notas Importantes

1. **CORS**: Asegúrate de que tu backend permita requests desde el dominio de GitHub Pages:
   ```
   https://[usuario].github.io
   ```

2. **Base Path**: Todas las rutas del frontend deben ser relativas para funcionar con el base path.

3. **Environment Variables**: Las variables de entorno con prefijo `VITE_` están disponibles en el código del frontend.

4. **Build Time**: El proceso de build toma aproximadamente 2-5 minutos.

## 🐛 Troubleshooting

### El deploy falla
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs en GitHub Actions
- Asegúrate de que `npm run build` funciona localmente

### La página muestra 404
- Verifica que GitHub Pages esté configurado para usar GitHub Actions
- Confirma que el base path en `vite.config.ts` coincide con el nombre del repo

### La API no responde
- Verifica el CORS en tu backend
- Confirma que `VITE_API_URL` está configurado correctamente
- Revisa la consola del navegador para errores de red

## 📚 Recursos

- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
