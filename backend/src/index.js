import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './lib/db.js';
import { initializeSocket } from './lib/socket.js';

import adminRoutes from './routes/admin.route.js';
import albumRoutes from './routes/album.route.js';
import authRoutes from './routes/auth.route.js';
import songRoutes from './routes/song.route.js';
import statRoutes from './routes/stat.route.js';
import userRoutes from './routes/user.route.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

// Initialize Socket.IO on the HTTP server.
initializeSocket(httpServer);

// Middleware.
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json());

app.use(clerkMiddleware());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, '../temp/'),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
  }),
);

// API routes.
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../fontend', 'dist', 'index.html'));
  });
}

// Error-handling middleware.
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
});

// Connect to MongoDB before accepting requests.
const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();
