import mongoose from "mongoose";

let retryCount = 0;
const maxRetries = 5;

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("Missing MONGO_URI in environment variables");
    }

    console.log("🔄 Attempting to connect to MongoDB...");
    console.log("   URI starts with:", uri.substring(0, 50) + "...");

    // Comprehensive connection options
    const options = {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 20000,
      family: 4, // Use IPv4
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    };

    await mongoose.connect(uri, options);

    console.log("✅ MongoDB Atlas Connected Successfully");
    retryCount = 0; // Reset on successful connection
    return true;
  } catch (error) {
    retryCount++;
    console.error("❌ MongoDB Connection Failed:", error.message);
    
    if (retryCount < maxRetries) {
      console.log(`⚠️  Retrying connection... (Attempt ${retryCount}/${maxRetries})`);
      
      // Exponential backoff
      const delay = 2000 * retryCount;
      setTimeout(() => {
        console.log("🔄 Retrying MongoDB connection...");
        connectDB();
      }, delay);
    } else {
      console.error("❌ Max retries reached. Server running without database.");
    }
  }
};

export default connectDB;
