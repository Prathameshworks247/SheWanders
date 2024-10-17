import express, { Router } from 'express';

import User from '../models/user.js';
import ChatRequest from '../models/chatRequest.js';

const router=Router();



router.post('/add-details',async (req,res,next)=>{
    try{
        const newUserDetails=new User(req.body);

        const DBuserDetails=await newUserDetails.save();

        return res.status(200).json({
            msg:'Added details to DB!',
            userId:DBuserDetails._id
        });
    } catch(err){
        return res.status(500).json({
            msg:'Some problem occured. Pls try again later.'
        });
    }
});

router.get('/get-users',async (req,res,next)=>{
    const userId=req.query.userId;
    try{
        const users=await User.find({});

        users=users.filter(user=>user._id!==userId);

        return res.status(200).json({
            users:users
        });
    } catch(err){
        return res.status(500).json({
            msg:'Some problem occured. Pls try again later.'
        });
    }
});

router.post('/send-chat-request',async (req,res,next)=>{
    const senderId=req.body.senderId;
    const receiverId=req.body.receiverId;
    try{
        const newChatRequest=new ChatRequest({
            sender:senderId,
            receiver:receiverId,
            status:'not accepted'
        });

        await newChatRequest.save();

        return res.status(200).json({
            msg:'Request successfully sent!'
        });
    } catch(err){
        return res.status(500).json({
            msg:'Some problem occured. Pls try again later.'
        });
    }
});

router.post('/update-chat-status',(req,res,next)=>{
    try{
        
    } catch(err){

    }
});

export default router;