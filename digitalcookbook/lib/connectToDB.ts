// lib/connectToDB.ts
import mongoose from "mongoose";
//single global connection variable
let isConnected = false;

export async function connectToDB() {
  //if we are already connected, return the connection
  if (isConnected) return mongoose;

  //if not, connect using MONGODB_URI
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");
  await mongoose.connect(uri, {
    dbName: "thriftyBitsDB", 
  });

  //set the global connection variable to true now, and log it
  isConnected = true;
  console.log("Connected to MongoDB");

  //return the connection
  return mongoose;
}
