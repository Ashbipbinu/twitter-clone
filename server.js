import express from 'express';
import authRoutes from './Routes/authRoutes.js';
import dotenv from 'dotenv';
import connectMongoDB from './dbConfig/dbConnect.js';

const app = express();
const PORT = process.env.PORT || 3000
dotenv.config()

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}`);
    connectMongoDB();
})