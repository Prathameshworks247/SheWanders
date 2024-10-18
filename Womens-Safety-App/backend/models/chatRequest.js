import mongoose, { Schema, model } from "mongoose";

const chatRequestSchema=new Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        required:true
    }
});

const ChatRequest=model('ChatRequest',chatRequestSchema);

export default ChatRequest;