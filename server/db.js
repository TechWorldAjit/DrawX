const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || 'drawx';

if (!MONGO_URI) {
  console.warn("WARNING: MONGO_URI is not set in environment variables!");
}

// Global cached connection for serverless execution
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DBNAME,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
      console.log(`Connected to MongoDB Atlas [DB: ${MONGODB_DBNAME}]`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e.message);
    throw e;
  }

  return cached.conn;
}

module.exports = connectDB;
