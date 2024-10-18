import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import mainRouter from './routes/index.js';

import { MONGODB_URI } from './config.js';

mongoose.connect(MONGODB_URI);

const app=express();

app.use(cors());
app.use(express.json());

app.use('/api',mainRouter);

app.listen(3000,()=>{
    console.log('Listening on port 3000!');
});