import mongoose from "mongoose";
import { isAdminAuthenticated } from "@/lib/checkAdminAuth";

let isConnected = false;
let currentURI: string | null = null;

export async function connectToDB(cookieStore: any) {
  const isAdmin = isAdminAuthenticated(cookieStore);

  const uri = isAdmin
    ? process.env.MONGODB_ADMIN_URI
    : process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MongoDB URI");
  }

  // If already connected AND using the same URI, reuse it
  if (isConnected && currentURI === uri) {
    return mongoose;
  }

  // If switching from user → admin or admin → user, create a new connection
  await mongoose.disconnect();

  await mongoose.connect(uri);

  isConnected = true;
  currentURI = uri;

  console.log("Connected to", isAdmin ? "ADMIN" : "USER", "database");

  return mongoose;
}