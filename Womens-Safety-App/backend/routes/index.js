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
                msg:'USer credentials are wrong!'
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

router.post('/add-details',async (req,res,next)=>{
    try{
        const newTravelDetails=new TravelDetails(req.body);

        await newTravelDetails.save();

        return res.status(200).json({
            msg:'Added details to DB!',
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
        const userTravelDetails=await TravelDetails.find({userId:userId});

        const users=await TravelDetails.find({
            time:userTravelDetails.time,
            date:userTravelDetails.date,
            'toCoords.lat': userTravelDetails.toCoords.lat,
            'toCoords.lng': userTravelDetails.toCoords.lng,
            'fromCoords.lat': userTravelDetails.fromCoords.lat,
            'fromCoords.lng': userTravelDetails.fromCoords.lng
        }).populate('userId','name email');

        users=users.filter(user=>user.userId._id!==userId);

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
    const updatedStatus=req.body.updatedStatus;
    try{

    } catch(err){
        return res.status(500).json({
            msg:'Some problem occured. Pls try again later.'
        });
    }
});

export default router;