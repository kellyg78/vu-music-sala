'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function BotControlPanel() {
  const { token } = useAuth();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState('');
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [volume, setVolume] = useState(50);
  const [error, setError] = useState('');

  // Obtener estado del bot
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imvu/status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        console.error('Error al obtener estado:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, [token]);

  // Buscar canciones
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search/youtube?q=${encodeURIComponent(searchQuery)}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('Error al buscar canciones');
    } finally {
      setSearching(false);
    }
  };

  // Entrar a sala
  const handleJoinRoom = async () => {
    if (!roomId.trim()) return;
    setJoiningRoom(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imvu/join-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roomId })
      });
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
        setRoomId('');
      }
    } catch (err) {
      setError('Error al entrar a la sala');
    } finally {
      setJoiningRoom(false);
    }
  };

  // Salir de sala
  const handleLeaveRoom = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imvu/leave-room`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      }
    } catch (err) {
      setError('Error al salir de la sala');
    }
  };

  // Reproducir canción
  const handlePlaySong = async (videoId: string, title: string, duration: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imvu/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ videoId, title, duration })
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentSong({ videoId, title, duration });
        setSearchResults([]);
        setSearchQuery('');
      }
    } catch (err) {
      setError('Error al reproducir canción');
    }
  };

  // Pausar
  const handlePause = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imvu/pause`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      setError('Error al pausar');
    }
  };

  // Reanudar
  const handleResume = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imvu/resume`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      setError('Error al reanudar');
    }
  };

  // Saltar
  const handleSkip = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imvu/skip`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCurrentSong(null);
    } catch (err) {
      setError('Error al saltar');
    }
  };

  // Cambiar volumen
  const handleVolumeChange = async (newVolume: number) => {
    setVolume(newVolume);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imvu/volume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ volume: newVolume })
      });
    } catch (err) {
      setError('Error al cambiar volumen');
    }
  };

  if (loading) {
    return <div className="text-center text-cyan-400">Cargando...</div>;
  }

  if (!status?.connected) {
    return (
      <div className="bg-yellow-900 border border-yellow-500 rounded p-4">
        <p className="text-yellow-400">Bot no conectado. Conecta primero desde la página de conexión.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-500 rounded p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Bot Status */}
      <div className="bg-gradient-to-r from-purple-900 to-black border border-purple-500 rounded-lg p-4">
        <h3 className="text-pink-400 font-bold mb-3">Estado del Bot</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Usuario:</p>
            <p className="text-cyan-400 font-bold">{status.status.username}</p>
          </div>
          <div>
            <p className="text-gray-400">Sala:</p>
            <p className="text-cyan-400 font-bold">{status.status.currentRoom || 'Ninguna'}</p>
          </div>
        </div>
      </div>

      {/* Room Control */}
      <div className="bg-gradient-to-r from-purple-900 to-black border border-purple-500 rounded-lg p-4">
        <h3 className="text-pink-400 font-bold mb-3">Control de Sala</h3>
        {!status.status.currentRoom ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="ID de la sala"
              className="flex-1 bg-gray-900 border border-purple-500 rounded px-3 py-2 text-white text-sm"
            />
            <button
              onClick={handleJoinRoom}
              disabled={joiningRoom}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-bold"
            >
              {joiningRoom ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleLeaveRoom}
            className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-bold"
          >
            Salir de la Sala
          </button>
        )}
      </div>

      {/* Music Search */}
      <div className="bg-gradient-to-r from-purple-900 to-black border border-purple-500 rounded-lg p-4">
        <h3 className="text-pink-400 font-bold mb-3">Buscar Música</h3>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar canción..."
            className="flex-1 bg-gray-900 border border-purple-500 rounded px-3 py-2 text-white text-sm"
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-bold"
          >
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="bg-gray-900 border border-gray-700 rounded p-2 flex justify-between items-center"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm truncate">{result.title}</p>
                  <p className="text-gray-500 text-xs">{result.channelTitle}</p>
                </div>
                <button
                  onClick={() => handlePlaySong(result.id, result.title, 0)}
                  className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs font-bold ml-2 flex-shrink-0"
                >
                  Reproducir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Now Playing */}
      {currentSong && (
        <div className="bg-gradient-to-r from-green-900 to-emerald-900 border border-green-500 rounded-lg p-4">
          <h3 className="text-green-400 font-bold mb-3">Reproduciendo Ahora</h3>
          <p className="text-gray-300 mb-4">{currentSong.title}</p>

          {/* Playback Controls */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handlePause}
              className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded text-sm font-bold"
            >
              Pausar
            </button>
            <button
              onClick={handleResume}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded text-sm font-bold"
            >
              Reanudar
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded text-sm font-bold"
            >
              Saltar
            </button>
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Volumen: {volume}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
