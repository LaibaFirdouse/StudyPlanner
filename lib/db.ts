import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

// ✅ Proper global typing
declare global {
  var mongooseGlobal: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// ✅ Initialize once
if (!global.mongooseGlobal) {
  global.mongooseGlobal = {
    conn: null,
    promise: null,
  };
}

const cached = global.mongooseGlobal;

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI");
  }

  // ✅ reuse connection
  if (cached.conn) return cached.conn;

  // ✅ create connection
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}