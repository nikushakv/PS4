import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '@utils/constants';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  playerId: string | null;
}

export const useSocket = (serverUrl: string): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!serverUrl) {
      console.error('Server URL is not defined. Socket connection not attempted.');
      return;
    }

    if (socketRef.current) return;

    const newSocket = io(serverUrl, {
      transports: ['websocket'],
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    const handleConnect = () => {
      console.log('🔗 Connected to server! Socket ID:', newSocket.id);
      setIsConnected(true);
      setPlayerId(newSocket.id ?? null); // ✅ Fix: fallback to null if undefined
    };

    const handleDisconnect = (reason: string) => {
      console.warn('🔌 Disconnected from server. Reason:', reason);
      setIsConnected(false);
      setPlayerId(null);
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    };

    const handleConnectError = (err: Error) => {
      console.error('❌ Socket connection error:', err.message);
      setIsConnected(false);
    };

    newSocket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    newSocket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    newSocket.on(SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);

    return () => {
      console.log('Cleaning up socket connection...');
      newSocket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      newSocket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      newSocket.off(SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);
      newSocket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setPlayerId(null);
    };
  }, [serverUrl]);

  return { socket, isConnected, playerId };
};
