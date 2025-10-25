import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("✅ MongoDB Connected");

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: "admin@jaihind-sports.com" });
    if (adminExists) {
      console.log("ℹ️ Default admin account already exists.");
      process.exit(0);
    }

    // Hash the password
    const password = "admin123"; // Plain password to login
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create default admin
    const admin = await Admin.create({
      name: "Jaihind Sports",
      email: "admin@jaihind-sports.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Default admin account created successfully:");
    console.log(`Email: ${admin.email}`);
    console.log(`Password (use this to login): ${password}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating default admin:", error.message);
    process.exit(1);
  }
};

createDefaultAdmin();
