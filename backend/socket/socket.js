import {Server} from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:'https://mern-social-media-deploy.onrender.com',
        methods:['GET', 'POST']
    }
})

const userSocketMap = {}; //this map stores socket id corresponding the user id; userId -> socketId

export const getRecieverSocketId = (recieverId) =>{
    return userSocketMap[recieverId];
}

io.on('connection', (socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));
    socket.on('disconnect', ()=>{
        if(userId){
            delete userSocketMap[userId];
        }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
})

export {app, server, io};