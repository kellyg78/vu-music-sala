'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function IMVUConnectPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [imvuUsername, setImvuUsername] = useState('');
  const [imvuPassword, setImvuPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imvu/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imvuUsername,
          imvuPassword
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al conectar');
      }

      const data = await response.json();
      setSuccess(true);
      setConnectionStatus(data.status);
      setImvuPassword('');

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imvu/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess(false);
        setConnectionStatus(null);
        setImvuUsername('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            Conectar IMVU
          </h1>
          <p className="text-gray-400 font-press-start text-xs">
            Bot de Música para Salas
          </p>
        </div>

        {/* Status Card */}
        {connectionStatus && (
          <div className="bg-gradient-to-r from-green-900 to-emerald-900 border border-green-500 rounded-lg p-4 mb-6">
            <div className="text-green-400 font-bold mb-2">✓ Conectado</div>
            <div className="text-sm text-gray-300 space-y-1">
              <p>Usuario: <span className="text-green-400">{connectionStatus.username}</span></p>
              <p>ID: <span className="text-green-400">{connectionStatus.userId}</span></p>
              {connectionStatus.currentRoom && (
                <p>Sala: <span className="text-green-400">{connectionStatus.currentRoom}</span></p>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        {!connectionStatus ? (
          <form onSubmit={handleConnect} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-pink-400 font-press-start text-xs mb-2">
                Usuario IMVU
              </label>
              <input
                type="text"
                value={imvuUsername}
                onChange={(e) => setImvuUsername(e.target.value)}
                placeholder="tu_usuario"
                className="w-full bg-gray-900 border-2 border-purple-500 rounded px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-pink-400 font-press-start text-xs mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={imvuPassword}
                onChange={(e) => setImvuPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-900 border-2 border-purple-500 rounded px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-500 rounded p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-900 border border-green-500 rounded p-3">
                <p className="text-green-400 text-sm">¡Conectado exitosamente! Redirigiendo...</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !imvuUsername || !imvuPassword}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded transition transform hover:scale-105"
            >
              {loading ? 'Conectando...' : 'Conectar'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Disconnect Button */}
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3 rounded transition"
            >
              {loading ? 'Desconectando...' : 'Desconectar'}
            </button>

            {/* Go to Dashboard Button */}
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded transition"
            >
              Ir al Dashboard
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-purple-900 border border-purple-500 rounded p-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="text-yellow-400 font-bold">⚠️ Nota:</span> Usa tus credenciales de IMVU. El bot se conectará a tu cuenta para controlar la música en las salas.
          </p>
        </div>
      </div>
    </div>
  );
}
