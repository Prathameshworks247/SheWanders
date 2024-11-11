import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const PORT=process.env.PORT||8000;

import mainRouter from './routes/index.js';

import { MONGODB_URI } from './config.js';

mongoose.connect(MONGODB_URI);

const app=express();

app.use(cors());
app.use(express.json());

app.use('/api',mainRouter);

app.listen(PORT,()=>{
    console.log('Listening on port 8000!');
});