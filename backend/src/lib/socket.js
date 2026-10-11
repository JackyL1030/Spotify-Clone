import { Server } from 'socket.io';
import { Message } from '../models/message.model.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  const userSockets = new Map(); // { userId: socketId }
  const userActivities = new Map(); // { userId: activity }

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Handle a user connecting.
    socket.on('user_connected', (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, 'Idle');

      // Notify connected clients that this user is online.
      io.emit('user_connected', userId);

      // Send the current online users to this client.
      socket.emit('users_online', Array.from(userSockets.keys()));

      // Broadcast the current user activities.
      io.emit('activities', Array.from(userActivities.entries()));
    });

    // Handle a user's activity update.
    socket.on('update_activity', ({ userId, activity }) => {
      console.log('Activity updated:', userId, activity);

      userActivities.set(userId, activity);

      io.emit('activity_updated', { userId, activity });
    });

    // Handle sending a message.
    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        // Deliver the message if the receiver is online.
        const receiverSocketId = userSockets.get(receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', message);
        }

        // Confirm successful message creation to the sender.
        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Message error:', error);

        socket.emit('message_error', error.message);
      }
    });

    // Handle a user disconnecting.
    socket.on('disconnect', () => {
      let disconnectedUserId;

      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;

          userSockets.delete(userId);
          userActivities.delete(userId);

          break;
        }
      }

      if (disconnectedUserId) {
        io.emit('user_disconnected', disconnectedUserId);

        io.emit('activities', Array.from(userActivities.entries()));
      }

      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
};
