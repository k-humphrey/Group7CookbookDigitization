import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({path: ".env.local"});

// MongoDB connection URI from environment variables
const URI = process.env.MONGODB_URI;

// Ensure the MongoDB URI is defined
if (!URI)
    throw new Error("Please define the MONGODB_URI variable inside .env.local");

// Global connection variable
let connection: mongoose.Mongoose | null = null;

// Function to connect to MongoDB
export async function connectToDB(): Promise<mongoose.Mongoose> {
    // Return existing connection if already connected
    if (connection) {
        return connection;

    }
    
    // Establish a new connection if none exists
    try {
        connection = await mongoose.connect(URI as string);
        return connection;

    } catch (error) {
        throw new Error("Error connecting to MongoDB", {cause: error as Error});
        
    }
}