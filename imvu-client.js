const axios = require('axios');
const EventEmitter = require('events');

/**
 * Cliente IMVU no oficial para control de bot de música
 * Conecta directamente a los servidores de IMVU
 */
class IMVUClient extends EventEmitter {
  constructor(username, password) {
    super();
    this.username = username;
    this.password = password;
    this.sessionId = null;
    this.userId = null;
    this.isConnected = false;
    this.currentRoom = null;
    this.currentSong = null;
    
    // Endpoints de IMVU (estos pueden cambiar)
    this.baseURL = 'https://api.imvu.com';
    this.wsURL = 'wss://chat.imvu.com';
  }

  /**
   * Conectar y autenticar con IMVU
   */
  async connect() {
    try {
      console.log(`[IMVU] Conectando como ${this.username}...`);
      
      // Obtener token de sesión
      const authResponse = await axios.post(`${this.baseURL}/auth/login`, {
        username: this.username,
        password: this.password
      });

      if (!authResponse.data.sessionId) {
        throw new Error('No se pudo obtener sessionId');
      }

      this.sessionId = authResponse.data.sessionId;
      this.userId = authResponse.data.userId;
      this.isConnected = true;

      console.log(`[IMVU] ✓ Conectado como ${this.username} (ID: ${this.userId})`);
      this.emit('connected', { userId: this.userId, username: this.username });

      return true;
    } catch (error) {
      console.error('[IMVU] Error al conectar:', error.message);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Entrar a una sala IMVU
   */
  async joinRoom(roomId) {
    try {
      if (!this.isConnected) {
        throw new Error('No estás conectado a IMVU');
      }

      console.log(`[IMVU] Entrando a sala ${roomId}...`);

      const response = await axios.post(
        `${this.baseURL}/rooms/${roomId}/join`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        }
      );

      this.currentRoom = roomId;
      console.log(`[IMVU] ✓ Entraste a la sala ${roomId}`);
      this.emit('room-joined', { roomId });

      return true;
    } catch (error) {
      console.error('[IMVU] Error al entrar a la sala:', error.message);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Salir de la sala actual
   */
  async leaveRoom() {
    try {
      if (!this.currentRoom) {
        throw new Error('No estás en ninguna sala');
      }

      console.log(`[IMVU] Saliendo de la sala ${this.currentRoom}...`);

      await axios.post(
        `${this.baseURL}/rooms/${this.currentRoom}/leave`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        }
      );

      const roomId = this.currentRoom;
      this.currentRoom = null;
      this.currentSong = null;

      console.log(`[IMVU] ✓ Saliste de la sala`);
      this.emit('room-left', { roomId });

      return true;
    } catch (error) {
      console.error('[IMVU] Error al salir de la sala:', error.message);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Reproducir una canción en la sala actual
   */
  async playSong(videoId, title, duration) {
    try {
      if (!this.currentRoom) {
        throw new Error('No estás en ninguna sala');
      }

      console.log(`[IMVU] Reproduciendo: ${title}`);

      const response = await axios.post(
        `${this.baseURL}/rooms/${this.currentRoom}/play`,
        {
          videoId,
          title,
          duration,
          source: 'youtube'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        }
      );

      this.currentSong = {
        videoId,
        title,
        duration,
        startedAt: new Date()
      };

      console.log(`[IMVU] ✓ Reproduciendo: ${title}`);
      this.emit('song-playing', { videoId, title, duration });

      return true;
    } catch (error) {
      console.error('[IMVU] Error al reproducir canción:', error.message);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Pausar la reproducción actual
   */
  async pauseSong() {
    try {
      if (!this.currentRoom || !this.currentSong) {
        throw new Error('No hay canción reproduciéndose');
      }

      console.log(`[IMVU] Pausando canción...`);

      await axios.post(
        `${this.baseURL}/rooms/${this.currentRoom}/pause`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        }
      );

      console.log(`[IMVU] ✓ Canción pausada`);
      this.emit('song-paused', { title: this.currentSong.title });

      return true;
    } catch (error) {
      console.error('[IMVU] Error al pausar:', error.message);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Reanudar la reproducción
   */
  async resumeSong() {
    try {
      if (!this.currentRoom || !this.currentSong) {
        throw new Error('No hay canción para reanudar');
      }

      console.log(`[IMVU] Reanudando canción...`);

      await axios.post(
        `${this.baseURL}/rooms/${this.currentRoom}/resume`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        }
      );

      console.log(`[IMVU] ✓ Canción reanudada`);
      this.emit('song-resumed', { title: this.currentSong.title });

      return true;
    } catch (error) {
      console.error('[IMVU] Error al reanudar:', error.message);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Saltar a la siguiente canción
   */
  async skipSong() {
    try {
      if (!this.currentRoom) {
        throw new Error('No estás en ninguna sala');
      }

      console.log(`[IMVU] Saltando canción...`);

      await axios.post(
        `${this.baseURL}/rooms/${this.currentRoom}/skip`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        }
      );

      this.currentSong = null;
      console.log(`[IMVU] ✓ Canción saltada`);
      this.emit('song-skipped', {});

      return true;
    } catch (error) {
      console.error('[IMVU] Error al saltar:', error.message);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Cambiar volumen
   */
  async setVolume(volume) {
    try {
      if (!this.currentRoom) {
        throw new Error('No estás en ninguna sala');
      }

      if (volume < 0 || volume > 100) {
        throw new Error('El volumen debe estar entre 0 y 100');
      }

      console.log(`[IMVU] Cambiando volumen a ${volume}%`);

      await axios.post(
        `${this.baseURL}/rooms/${this.currentRoom}/volume`,
        { volume },
        {
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        }
      );

      console.log(`[IMVU] ✓ Volumen cambiado a ${volume}%`);
      this.emit('volume-changed', { volume });

      return true;
    } catch (error) {
      console.error('[IMVU] Error al cambiar volumen:', error.message);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Enviar mensaje a la sala
   */
  async sendMessage(message) {
    try {
      if (!this.currentRoom) {
        throw new Error('No estás en ninguna sala');
      }

      console.log(`[IMVU] Enviando mensaje: ${message}`);

      await axios.post(
        `${this.baseURL}/rooms/${this.currentRoom}/message`,
        { message },
        {
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        }
      );

      this.emit('message-sent', { message });
      return true;
    } catch (error) {
      console.error('[IMVU] Error al enviar mensaje:', error.message);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Obtener información de la sala actual
   */
  async getRoomInfo() {
    try {
      if (!this.currentRoom) {
        throw new Error('No estás en ninguna sala');
      }

      const response = await axios.get(
        `${this.baseURL}/rooms/${this.currentRoom}`,
        {
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('[IMVU] Error al obtener info de la sala:', error.message);
      this.emit('error', error);
      return null;
    }
  }

  /**
   * Obtener lista de usuarios en la sala
   */
  async getRoomUsers() {
    try {
      if (!this.currentRoom) {
        throw new Error('No estás en ninguna sala');
      }

      const response = await axios.get(
        `${this.baseURL}/rooms/${this.currentRoom}/users`,
        {
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        }
      );

      return response.data.users || [];
    } catch (error) {
      console.error('[IMVU] Error al obtener usuarios:', error.message);
      this.emit('error', error);
      return [];
    }
  }

  /**
   * Desconectar de IMVU
   */
  async disconnect() {
    try {
      if (this.currentRoom) {
        await this.leaveRoom();
      }

      console.log('[IMVU] Desconectando...');

      await axios.post(
        `${this.baseURL}/auth/logout`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        }
      );

      this.isConnected = false;
      this.sessionId = null;
      this.userId = null;

      console.log('[IMVU] ✓ Desconectado');
      this.emit('disconnected', {});

      return true;
    } catch (error) {
      console.error('[IMVU] Error al desconectar:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Obtener estado actual del bot
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      username: this.username,
      userId: this.userId,
      currentRoom: this.currentRoom,
      currentSong: this.currentSong
    };
  }
}

module.exports = IMVUClient;
