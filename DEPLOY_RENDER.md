# 🚀 Guía de Despliegue en Render - Vu Music Sala

## Paso 1: Acceder a Render desde tu móvil

1. Abre tu navegador y ve a: **https://dashboard.render.com**
2. Haz clic en **"Sign in with GitHub"** (o crea cuenta si no tienes)
3. Autoriza Render para acceder a tus repositorios

## Paso 2: Crear nuevo Web Service

1. En el dashboard, haz clic en **"New +"** (arriba a la derecha)
2. Selecciona **"Web Service"**
3. Busca y selecciona el repositorio **`vu-music-sala`**
4. Haz clic en **"Connect"**

## Paso 3: Configurar el servicio

Completa los siguientes campos:

| Campo | Valor |
|-------|-------|
| **Name** | `vu-music-sala-backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | `Free` (o Starter si quieres) |

## Paso 4: Agregar variables de entorno

En la sección **"Environment"**, haz clic en **"Add Environment Variable"** y agrega estas variables:

```
DB_HOST = localhost
DB_USER = postgres
DB_PASSWORD = postgres
DB_PORT = 5432
DB_NAME = vu_music_bot
JWT_SECRET = tu-secret-key-super-seguro-2024
YOUTUBE_API_KEY = AIzaSyCkj4QFYsKkEK_5OKVMMQlTtIjzkvViIv8
PORT = 3001
NODE_ENV = production
```

**⚠️ IMPORTANTE:** 
- Cambia `JWT_SECRET` por algo único y seguro
- `YOUTUBE_API_KEY` ya está configurada
- Para `DB_HOST`, si usas Render PostgreSQL, copia el host desde tu base de datos

## Paso 5: Desplegar

1. Haz clic en **"Create Web Service"**
2. Espera a que se despliegue (toma 2-5 minutos)
3. Verás un URL como: `https://vu-music-sala-backend.onrender.com`

## Paso 6: Verificar que funciona

Una vez desplegado, abre en tu navegador:

```
https://vu-music-sala-backend.onrender.com/api/search/youtube?q=test
```

Si ves resultados de YouTube, ¡está funcionando! ✅

## Paso 7: Actualizar el frontend

En Netlify (donde está el frontend), actualiza la variable de entorno:

1. Ve a tu sitio en Netlify
2. Sitio → Configuración → Variables de entorno
3. Cambia `NEXT_PUBLIC_API_URL` a tu URL de Render:

```
NEXT_PUBLIC_API_URL = https://vu-music-sala-backend.onrender.com
```

4. Guarda y espera a que se redepliegue

## Paso 8: Probar todo junto

1. Ve a tu sitio de Netlify
2. Inicia sesión
3. Haz clic en **"Connect Bot"**
4. Ingresa tus credenciales de IMVU
5. ¡Busca una canción y reproduce!

## Troubleshooting

### El backend no se inicia
- Revisa los logs en Render: tu servicio → Logs
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que `package.json` tiene todas las dependencias

### Error "Cannot find module"
- Ejecuta `npm install` en tu máquina local
- Haz commit y push de `package-lock.json`

### Base de datos no conecta
- Si usas Render PostgreSQL, copia el host correcto
- Verifica que la base de datos existe
- Asegúrate de que las credenciales son correctas

### YouTube API no funciona
- Verifica que la clave sea válida
- Comprueba que YouTube Data API v3 está habilitada en Google Cloud

## Monitoreo

Render te proporciona:
- **Logs en tiempo real** - Ver qué está pasando
- **Métricas** - CPU, memoria, solicitudes
- **Alertas** - Si algo falla

Todo está en el dashboard de Render.

## Próximos pasos

Una vez desplegado:
1. ✅ Conectar bot IMVU desde el dashboard
2. ✅ Buscar canciones en YouTube
3. ✅ Reproducir en salas IMVU
4. ✅ Controlar volumen y reproducción

¡Listo! 🎉
