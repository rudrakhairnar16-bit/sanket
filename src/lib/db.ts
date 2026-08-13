import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect(): Promise<typeof mongoose> {
  return mongoose.connect(MONGODB_URI!, {
    serverSelectionTimeoutMS: 2000,
    connectTimeoutMS: 2000,
  });
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = connect();
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}
