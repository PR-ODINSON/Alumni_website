import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | null>(null);

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/, '') || 'http://localhost:5000';
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessToken, isAuthenticated } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketUrl = getSocketUrl();
    console.log(`Connecting to socket at: ${socketUrl}`);
    const newSocket = io(socketUrl, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket.io connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.io disconnected');
      setIsConnected(false);
    });

    newSocket.on('notification', (data: any) => {
      console.log('Real-time notification received:', data);
      // Invalidate queries so notifications fetch real-time data
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      // Optionally display a toast
      if (data?.message) {
        toast(data.message, { icon: '🔔' });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [accessToken, isAuthenticated, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
