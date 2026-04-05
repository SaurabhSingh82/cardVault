const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const jwt = require('jsonwebtoken');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cards', require('./routes/giftCardRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/deals', require('./routes/dealRoutes'));

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});



// AUTH MIDDLEWARE FOR SOCKET
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("Authentication error"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // attach user
        next();
    } catch (error) {
        next(new Error("Invalid token"));
    }
});

//helper Function for Automatice roomID genration
const generateRoomId = (user1, user2) => {
    return [user1, user2].sort().join('_');
};


// MAIN SOCKET LOGIC (YOU MISSED THIS)
io.on('connection', (socket) => {
    console.log("User connected:", socket.id);

    // Join room
    socket.on('joinRoom', ({ receiver }) => {
    const roomId = generateRoomId(socket.user.id, receiver);

    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
    });

    // Send message (SECURE)
    socket.on('sendMessage', async ({ receiver, message }) => {
    try {
        if (!message) return;

        const roomId = generateRoomId(socket.user.id, receiver);

        const newMessage = await Message.create({
            sender: socket.user.id,
            receiver,
            message,
            roomId
        });

        io.to(roomId).emit('receiveMessage', newMessage);

    } catch (error) {
        console.log("Message Error:", error);
    }
});

    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id);
    });
});


// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});