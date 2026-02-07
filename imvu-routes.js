const express = require('express');
const router = express.Router();
const IMVUClient = require('./imvu-client');

// Almacenar instancias de clientes IMVU por usuario
const imvuClients = new Map();

/**
 * Middleware de autenticación (asume que viene del servidor principal)
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  // En producción, verificar el token JWT aquí
  req.user = { id: 1 }; // Placeholder
  next();
}

/**
 * Conectar bot de IMVU
 * POST /api/imvu/connect
 */
router.post('/connect', authenticateToken, async (req, res) => {
  try {
    const { imvuUsername, imvuPassword } = req.body;

    if (!imvuUsername || !imvuPassword) {
      return res.status(400).json({ error: 'Usuario y contraseña de IMVU requeridos' });
    }

    // Verificar si ya existe una conexión
    if (imvuClients.has(req.user.id)) {
      return res.status(400).json({ error: 'Ya hay una conexión activa' });
    }

    // Crear nueva instancia del cliente
    const client = new IMVUClient(imvuUsername, imvuPassword);

    // Conectar
    const connected = await client.connect();

    if (!connected) {
      return res.status(401).json({ error: 'No se pudo conectar a IMVU. Verifica credenciales.' });
    }

    // Guardar cliente
    imvuClients.set(req.user.id, client);

    // Escuchar eventos
    client.on('error', (error) => {
      console.error('[Error IMVU]', error.message);
    });

    client.on('disconnected', () => {
      imvuClients.delete(req.user.id);
    });

    res.json({
      message: 'Conectado a IMVU exitosamente',
      status: client.getStatus()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al conectar' });
  }
});

/**
 * Desconectar bot de IMVU
 * POST /api/imvu/disconnect
 */
router.post('/disconnect', authenticateToken, async (req, res) => {
  try {
    const client = imvuClients.get(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'No hay conexión activa' });
    }

    await client.disconnect();
    imvuClients.delete(req.user.id);

    res.json({ message: 'Desconectado de IMVU' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al desconectar' });
  }
});

/**
 * Entrar a una sala
 * POST /api/imvu/join-room
 */
router.post('/join-room', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.body;
    const client = imvuClients.get(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'No hay conexión activa' });
    }

    if (!roomId) {
      return res.status(400).json({ error: 'roomId requerido' });
    }

    const success = await client.joinRoom(roomId);

    if (!success) {
      return res.status(400).json({ error: 'No se pudo entrar a la sala' });
    }

    res.json({
      message: 'Entraste a la sala',
      status: client.getStatus()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al entrar a la sala' });
  }
});

/**
 * Salir de la sala
 * POST /api/imvu/leave-room
 */
router.post('/leave-room', authenticateToken, async (req, res) => {
  try {
    const client = imvuClients.get(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'No hay conexión activa' });
    }

    const success = await client.leaveRoom();

    if (!success) {
      return res.status(400).json({ error: 'No se pudo salir de la sala' });
    }

    res.json({
      message: 'Saliste de la sala',
      status: client.getStatus()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al salir de la sala' });
  }
});

/**
 * Reproducir canción
 * POST /api/imvu/play
 */
router.post('/play', authenticateToken, async (req, res) => {
  try {
    const { videoId, title, duration } = req.body;
    const client = imvuClients.get(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'No hay conexión activa' });
    }

    if (!videoId || !title) {
      return res.status(400).json({ error: 'videoId y title requeridos' });
    }

    const success = await client.playSong(videoId, title, duration || 0);

    if (!success) {
      return res.status(400).json({ error: 'No se pudo reproducir la canción' });
    }

    res.json({
      message: 'Reproduciendo canción',
      status: client.getStatus()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al reproducir' });
  }
});

/**
 * Pausar canción
 * POST /api/imvu/pause
 */
router.post('/pause', authenticateToken, async (req, res) => {
  try {
    const client = imvuClients.get(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'No hay conexión activa' });
    }

    const success = await client.pauseSong();

    if (!success) {
      return res.status(400).json({ error: 'No se pudo pausar' });
    }

    res.json({
      message: 'Canción pausada',
      status: client.getStatus()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al pausar' });
  }
});

/**
 * Reanudar canción
 * POST /api/imvu/resume
 */
router.post('/resume', authenticateToken, async (req, res) => {
  try {
    const client = imvuClients.get(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'No hay conexión activa' });
    }

    const success = await client.resumeSong();

    if (!success) {
      return res.status(400).json({ error: 'No se pudo reanudar' });
    }

    res.json({
      message: 'Canción reanudada',
      status: client.getStatus()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al reanudar' });
  }
});

/**
 * Saltar canción
 * POST /api/imvu/skip
 */
router.post('/skip', authenticateToken, async (req, res) => {
  try {
    const client = imvuClients.get(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'No hay conexión activa' });
    }

    const success = await client.skipSong();

    if (!success) {
      return res.status(400).json({ error: 'No se pudo saltar' });
    }

    res.json({
      message: 'Canción saltada',
      status: client.getStatus()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al saltar' });
  }
});

/**
 * Cambiar volumen
 * POST /api/imvu/volume
 */
router.post('/volume', authenticateToken, async (req, res) => {
  try {
    const { volume } = req.body;
    const client = imvuClients.get(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'No hay conexión activa' });
    }

    if (volume === undefined) {
      return res.status(400).json({ error: 'volume requerido' });
    }

    const success = await client.setVolume(volume);

    if (!success) {
      return res.status(400).json({ error: 'No se pudo cambiar volumen' });
    }

    res.json({
      message: `Volumen cambiado a ${volume}%`,
      status: client.getStatus()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar volumen' });
  }
});

/**
 * Enviar mensaje
 * POST /api/imvu/message
 */
router.post('/message', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    const client = imvuClients.get(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'No hay conexión activa' });
    }

    if (!message) {
      return res.status(400).json({ error: 'message requerido' });
    }

    const success = await client.sendMessage(message);

    if (!success) {
      return res.status(400).json({ error: 'No se pudo enviar mensaje' });
    }

    res.json({ message: 'Mensaje enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

/**
 * Obtener estado del bot
 * GET /api/imvu/status
 */
router.get('/status', authenticateToken, (req, res) => {
  try {
    const client = imvuClients.get(req.user.id);

    if (!client) {
      return res.json({ connected: false });
    }

    res.json({
      connected: true,
      status: client.getStatus()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estado' });
  }
});

/**
 * Obtener información de la sala
 * GET /api/imvu/room-info
 */
router.get('/room-info', authenticateToken, async (req, res) => {
  try {
    const client = imvuClients.get(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'No hay conexión activa' });
    }

    const roomInfo = await client.getRoomInfo();

    res.json(roomInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener info de la sala' });
  }
});

/**
 * Obtener usuarios en la sala
 * GET /api/imvu/room-users
 */
router.get('/room-users', authenticateToken, async (req, res) => {
  try {
    const client = imvuClients.get(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'No hay conexión activa' });
    }

    const users = await client.getRoomUsers();

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

module.exports = router;
