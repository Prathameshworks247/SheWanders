import mongoose, { Schema, model } from "mongoose";

const chatRequestSchema=new Schema({
    sender:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    receiver:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true
    }
});

const ChatRequest=model('ChatRequest',chatRequestSchema);

export default ChatRequest;