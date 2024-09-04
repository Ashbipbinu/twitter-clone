import express from 'express';
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';

import connectMongoDB from './dbConfig/dbConnect.js';
import cookieParser from 'cookie-parser';

import authRoutes from './Routes/authRoutes.js';
import userRouter from './Routes/userRoutes.js';
import postRouter from './Routes/postRoutes.js';
import notificationRouter from './Routes/notificationRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

app.use(express.json())
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/notififcations', notificationRouter)

app.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}`);
    connectMongoDB();
})