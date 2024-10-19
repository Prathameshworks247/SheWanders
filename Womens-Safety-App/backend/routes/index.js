import express, { Router } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import ChatRequest from '../models/chatRequest.js';
import TravelDetails from '../models/travelDetails.js';

import { authMiddleware } from '../middlewares/auth.js';

import { JWT_SECRET } from '../config.js';

const router=Router();

router.post('/signup',async (req,res,next)=>{
    try{
        const user=await User.findOne({email:req.body.email});

        if(user){
            return res.status(401).json({
                msg:'User with email already exists'
            });
        }

        const newUser=new User(req.body);

        await newUser.save();

        return res.status(200).json({
            msg:'User created successfully!'
        });
    } catch(err){
        return res.status(500).json({
            msg:'Some problem occured. Pls try again later.'
        });
    }
});

router.post('/login',async (req,res,next)=>{
    try{
        const user=await User.findOne({email:req.body.email});

        if(!user || user.password!==req.body.password){
            return res.status(404).json({
                msg:'User credentials are wrong!'
            });
        }

        const token=jwt.sign({
            userId:user._id,
        },JWT_SECRET);

        return res.status(200).json({
            token:token
        });
    } catch(err){
        return res.status(500).json({
            msg:'Some problem occured. Pls try again later.'
        });
    }
})

router.post('/travel-details',authMiddleware,async (req,res,next)=>{
    try{
        const newTravelDetails=new TravelDetails({
            userId:req.userId,
            time:req.body.time,
            date:req.body.date,
            fromCoords:{
                lat:req.body.fromCoords.lat,
                lng:req.body.fromCoords.lng
            },
            toCoords:{
                lat:req.body.toCoords.lat,
                lng:req.body.toCoords.lng
            }
        });

        await newTravelDetails.save();

        return res.status(200).json({
            msg:'Added details to DB!',
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            msg:'Some problem occured. Pls try again later.'
        });
    }
});

router.get('/users',authMiddleware,async (req,res,next)=>{
    const userId=req.userId;
    try{
        const userTravelDetails=await TravelDetails.findOne({userId:userId});

        const users=await TravelDetails.find({
            time:userTravelDetails.time,
            date:userTravelDetails.date,
            'toCoords.lat': userTravelDetails.toCoords.lat,
            'toCoords.lng': userTravelDetails.toCoords.lng,
            'fromCoords.lat': userTravelDetails.fromCoords.lat,
            'fromCoords.lng': userTravelDetails.fromCoords.lng
        }).populate('userId','username email _id');

        const filteredUsers=users.filter(user=>user.userId._id!=userId);

        return res.status(200).json({
            users:filteredUsers
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            msg:'Some problem occured. Pls try again later.'
        });
    }
});

router.get('/pending-requests',authMiddleware,async (req,res,next)=>{
    const userId=req.userId;
    try{
        const pendingUserRequests=await ChatRequest.find({
            receiver:userId,
            status:'not accepted'
        }).populate('sender','_id username email');

        return res.status(200).json({
            pendingRequests:pendingUserRequests
        });
    } catch(err){
        return res.status(500).json({
            msg:'Some problem occured. Pls try again later.'
        });
    }
});

router.post('/send-chat-request',authMiddleware,async (req,res,next)=>{
    const senderId=req.userId;
    const receiverId=req.body.receiverId;
    try{
        const newChatRequest=new ChatRequest({
            sender:senderId,
            receiver:receiverId,
            status:'not accepted'
        });

        const DBchatRequest=await newChatRequest.save();

        const DBpopulatedChatRequest=await DBchatRequest.populate('sender receiver','name _id email');

        return res.status(200).json({
            msg:'Request successfully sent!',
            chatDetails:DBpopulatedChatRequest
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            msg:'Some problem occured. Pls try again later.'
        });
    }
});

router.post('/update-chat-status',authMiddleware,async (req,res,next)=>{
    const senderId=req.body.senderId;
    const receiverId=req.userId;
    try{
        const chatRequest=await ChatRequest.findOne({
            receiver:receiverId,
            sender:senderId
        });

        chatRequest.status='accepted';

        const DBchatRequest=await chatRequest.save();

        const DBpopulatedChatRequest=await DBchatRequest.populate('sender receiver','_id username email');

        return res.status(200).json({
            msg:'Request successfully accepted!',
            chatDetails:DBpopulatedChatRequest
        });
    } catch(err){
        return res.status(500).json({
            msg:'Some problem occured. Pls try again later.'
        });
    }
});

export default router;