import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { Server as SocketServer } from 'socket.io';

import { connectDB } from './config/database';
import { configurePassport } from './config/passport';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { socketHandler } from './services/socketService';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import alumniRoutes from './routes/alumni.routes';
import studentRoutes from './routes/student.routes';
import connectionRoutes from './routes/connection.routes';
import messageRoutes from './routes/message.routes';
import postRoutes from './routes/post.routes';
import jobRoutes from './routes/job.routes';
import eventRoutes from './routes/event.routes';
import mentorshipRoutes from './routes/mentorship.routes';
import successStoryRoutes from './routes/successStory.routes';
import analyticsRoutes from './routes/analytics.routes';
import adminRoutes from './routes/admin.routes';
import notificationRoutes from './routes/notification.routes';
import researchRoutes from './routes/research.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();
const httpServer = http.createServer(app);

const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Connect Database
connectDB();

// Configure Passport
configurePassport();
app.use(passport.initialize());

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiting
app.use('/api/', rateLimiter);

// Socket.IO
socketHandler(io);
app.set('io', io);

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'IITRAM Alumni Platform API',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/success-stories', successStoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║     IITRAM Alumni Platform API v1.0       ║
  ║     Running on port ${PORT}                  ║
  ║     Environment: ${process.env.NODE_ENV || 'development'}           ║
  ╚═══════════════════════════════════════════╝
  `);
});

export { app, io };
