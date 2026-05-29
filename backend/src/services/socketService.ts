import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';

const connectedUsers = new Map<string, string>();

export const socketHandler = (io: SocketServer): void => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      socket.data.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    connectedUsers.set(userId, socket.id);
    socket.join(userId);

    console.log(`User connected: ${userId}`);

    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation_${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation_${conversationId}`);
    });

    socket.on('typing', ({ conversationId, isTyping }: { conversationId: string; isTyping: boolean }) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        userId,
        conversationId,
        isTyping,
      });
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`User disconnected: ${userId}`);
    });
  });
};

export const isUserOnline = (userId: string): boolean => connectedUsers.has(userId);
export const getOnlineUsers = (): string[] => Array.from(connectedUsers.keys());
