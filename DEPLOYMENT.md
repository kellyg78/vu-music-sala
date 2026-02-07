# Guía de Despliegue - Vu Music Sala Backend

## Despliegue en Render (Recomendado)

### Paso 1: Crear cuenta en Render
1. Ve a [render.com](https://render.com)
2. Regístrate con tu cuenta de GitHub
3. Autoriza Render para acceder a tus repositorios

### Paso 2: Crear nuevo servicio
1. En el dashboard de Render, haz clic en **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio `vu-music-sala`
4. Elige la rama `main`

### Paso 3: Configurar el servicio
- **Name**: `vu-music-sala-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node /home/ubuntu/vu-music-bot-backend/server.js`
- **Plan**: Free (o Starter si necesitas más recursos)

### Paso 4: Configurar variables de entorno
En la sección "Environment", agrega:

```
DB_HOST=your_postgres_host
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432
DB_NAME=vu_music_bot
JWT_SECRET=your-secret-key-change-in-production
YOUTUBE_API_KEY=AIzaSyCkj4QFYsKkEK_5OKVMMQlTtIjzkvViIv8
PORT=3001
NODE_ENV=production
```

### Paso 5: Desplegar
Haz clic en **"Create Web Service"** y espera a que se despliegue.

## Configurar Base de Datos PostgreSQL

### Opción 1: Usar Render PostgreSQL
1. En Render, crea un nuevo **PostgreSQL Database**
2. Copia las credenciales
3. Usa esas credenciales en las variables de entorno

### Opción 2: Usar base de datos existente
Si ya tienes PostgreSQL configurado, usa esas credenciales.

## Inicializar Base de Datos

Una vez desplegado, ejecuta:

```bash
curl -X POST https://tu-backend.onrender.com/api/init-db \
  -H "Content-Type: application/json"
```

O manualmente, ejecuta el script SQL:

```sql
-- Crear tablas
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'offline',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE playlist (
  id SERIAL PRIMARY KEY,
  room_id INTEGER REFERENCES rooms(id),
  video_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  duration INTEGER,
  added_by INTEGER REFERENCES users(id),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Verificar Despliegue

Una vez desplegado, prueba los endpoints:

```bash
# Test de salud
curl https://tu-backend.onrender.com/api/health

# Buscar canción
curl -X GET "https://tu-backend.onrender.com/api/search/youtube?q=test" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Actualizar Frontend

En el frontend (Netlify), actualiza la variable de entorno:

```
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com
```

## Troubleshooting

### El backend no se inicia
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs en Render: Dashboard → Tu servicio → Logs

### Error de conexión a base de datos
- Verifica las credenciales de PostgreSQL
- Asegúrate de que la base de datos existe
- Comprueba que el host es accesible desde Render

### YouTube API no funciona
- Verifica que la clave de API sea válida
- Asegúrate de que YouTube Data API v3 está habilitada en Google Cloud Console
- Verifica que no hayas excedido el límite de cuota

## Monitoreo

Render proporciona:
- Logs en tiempo real
- Métricas de CPU y memoria
- Alertas de errores

Accede a través del dashboard de Render.
