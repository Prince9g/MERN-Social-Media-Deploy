//for chatting
import { Conversation } from '../models/conversation.model.js';
import { Message } from '../models/message.model.js';
import { getRecieverSocketId, io } from '../socket/socket.js';

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        const {textMessage:message} = req.body;
        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, recieverId]}
        });
        //establish the conversation if not started yet.

        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, recieverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            recieverId,
            message
        });
        if(newMessage) conversation.messages.push(newMessage._id);
        //for saving all schema frequently
        await Promise.all([conversation.save(), newMessage.save()]);

        //implement socket io for real time data transfer
        const recieverSocketId = getRecieverSocketId(recieverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit('newMessage', newMessage);
        }

        
        return res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId, recieverId]}
        }).populate('messages');
        if(!conversation) return res.status(200).json({success:true, messages:[]});

        return res.status(200).json({success:true, messages:conversation?.messages});
    } catch (error) {
        console.log(error);
    }
}