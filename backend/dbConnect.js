import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const db_connect = process.env.MongoDB_URL

async function connectDB() {
    try {
        const URL = await mongoose.connect(db_connect)
        console.log('MongoDB Connected')
    } catch (error) {
        console.log(error)
    }
}

connectDB()