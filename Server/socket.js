import { Socket, Server as SocketIOServer } from 'socket.io';
import Message from './models/MessagesModel.js';
import Channel from './models/ChannelModel.js';

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const SendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        //message must be stored in the database
        const createdMessage = await Message.create(message);

        // to send message details to the user we need to populate the sender and recipient
        const messageData = await Message.findById(createdMessage._id)
            .populate('sender', 'id email firstName lastName image color')
            .populate('recipient', 'id email firstName lastName image color');

        if (recipientSocketId) {
            io.to(recipientSocketId).emit('messageReceived', messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit('messageReceived', messageData);
        }
    }

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;

        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timestamp: Date.now(),
            fileUrl,
        });

        const messageData = await Message.findById(createdMessage._id)
            .populate('sender', 'id email firstName lastName image color')
            .exec();

        await Channel.findByIdAndUpdate(channelId, {
            $push: {
                messages: createdMessage._id,
            },
        });

        const channel = await Channel.findById(channelId).populate('members');

        const finalData = { ...messageData._doc, channelId: channel._id };

        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("recieve-channel-message", finalData);
                }
            });
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit("recieve-channel-message", finalData);
            }
        }

    };

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        }
        else {
            console.log("USer Id is not provided during connection");
        }

        socket.on('sendMessage', SendMessage);
        socket.on('send-channel-message', sendChannelMessage);
        socket.on('disconnect', () => disconnect(socket));
    });
};

export default setupSocket;