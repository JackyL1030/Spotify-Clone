import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import { createServer } from 'http';
import cron from 'node-cron';
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
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
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

// Cron job: clean up temporary files every hour.
const tempDir = path.join(process.cwd(), 'tmp');

cron.schedule('0 * * * *', () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.error('Error reading temporary directory:', err);
        return;
      }

      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {
          if (err) {
            console.error(`Error deleting temporary file ${file}:`, err);
          }
        });
      }
    });
  }
});

// API routes.
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statRoutes);

// Serve the React frontend in production.
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.resolve(__dirname, '../frontend/dist');

  app.use(express.static(frontendPath));

  // Express 5-compatible wildcard route.
  app.get('/{*path}', (req, res, next) => {
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        next(err);
      }
    });
  });
}

// Error-handling middleware.
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || err.statusCode || 500).json({
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
