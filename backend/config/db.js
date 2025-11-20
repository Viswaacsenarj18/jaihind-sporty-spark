import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("Missing MONGO_URI in environment variables");
    }

    console.log("🔄 Attempting to connect to MongoDB...");
    console.log("   URI starts with:", uri.substring(0, 50) + "...");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    console.log("⚠️  Server will continue running without DB. Some features may not work.");
    // Don't exit - let server run for development/testing
    // In production, you may want to process.exit(1)
  }
};

export default connectDB;
