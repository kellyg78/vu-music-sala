const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const axios = require('axios');
const { Pool } = require('pg');
const imvuRoutes = require('./imvu-routes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'vu_music_bot'
});

// Variables globales
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// ============ IMPORTAR RUTAS EXTERNAS ============
app.use('/api/imvu', imvuRoutes);

// ============ RUTAS DE AUTENTICACIÓN ============

// Registro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario o email ya existe' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Crear usuario
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.rows[0].id, username: result.rows[0].username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// ============ RUTAS DE SALAS ============

// Obtener todas las salas del usuario
app.get('/api/rooms', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rooms WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener salas' });
  }
});

// Crear nueva sala
app.post('/api/rooms', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre de la sala es requerido' });
    }

    const result = await pool.query(
      'INSERT INTO rooms (user_id, name, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, name, description || '', 'offline']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear sala' });
  }
});

// ============ RUTAS DE MÚSICA ============

// Buscar canciones en YouTube
app.get('/api/search/youtube', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }

    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ error: 'YouTube API key no configurada' });
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: q,
        type: 'video',
        maxResults: 10,
        key: YOUTUBE_API_KEY
      }
    });

    const results = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle
    }));

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar en YouTube' });
  }
});

// Agregar canción a playlist
app.post('/api/playlist/add', authenticateToken, async (req, res) => {
  try {
    const { room_id, video_id, title, duration } = req.body;

    if (!room_id || !video_id || !title) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    const result = await pool.query(
      'INSERT INTO playlist (room_id, video_id, title, duration, added_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [room_id, video_id, title, duration || 0, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar canción' });
  }
});

// Obtener playlist de una sala
app.get('/api/playlist/:room_id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM playlist WHERE room_id = $1 ORDER BY position ASC',
      [req.params.room_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener playlist' });
  }
});

// ============ MIDDLEWARE DE AUTENTICACIÓN ============

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

// ============ WEBSOCKETS PARA CONTROL EN TIEMPO REAL ============

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Unirse a una sala
  socket.on('join-room', (roomId) => {
    socket.join(`room-${roomId}`);
    console.log(`Cliente ${socket.id} se unió a la sala ${roomId}`);
  });

  // Control de reproducción
  socket.on('play', (data) => {
    io.to(`room-${data.roomId}`).emit('playing', data);
  });

  socket.on('pause', (data) => {
    io.to(`room-${data.roomId}`).emit('paused', data);
  });

  socket.on('skip', (data) => {
    io.to(`room-${data.roomId}`).emit('skipped', data);
  });

  socket.on('volume-change', (data) => {
    io.to(`room-${data.roomId}`).emit('volume-changed', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// ============ INICIAR SERVIDOR ============

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log('WebSocket activo para control en tiempo real');
});

module.exports = app;
