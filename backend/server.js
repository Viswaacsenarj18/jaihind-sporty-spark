import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Load environment variables
dotenv.config();

// ✅ Log JWT Secret (ONLY for debugging - REMOVE in production!)
console.log("🔐 JWT_SECRET from .env:", process.env.JWT_SECRET || "NOT FOUND - Using fallback");
console.log("🔐 NODE_ENV:", process.env.NODE_ENV || "development");

// Fix ES module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect Database
connectDB();

// ✅ REQUIRED for Cookies (MUST BE BEFORE CORS)
app.set("trust proxy", 1);

// ✅ CORS Configuration - Allow Vercel production + localhost
// This CORS config accepts:
// - jaihind-sporty-spark.vercel.app (production frontend)
// - *.vercel.app (preview deployments)
// - localhost (all ports for local dev)
// - Rejects other origins for security
const corsOptions = {
  origin: function (origin, callback) {
    // Allow specific Vercel domain + all vercel preview deployments + localhost
    if (
      !origin || 
      origin === "https://jaihind-sporty-spark.vercel.app" ||
      origin.includes("vercel.app") || 
      origin.includes("localhost") || 
      origin.includes("127.0.0.1")
    ) {
      callback(null, true);
    } else {
      console.warn("❌ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ✅ Explicit OPTIONS handler for all routes
app.options("*", cors(corsOptions));

// ✅ Request logging middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} from ${req.get('origin') || 'unknown'}`);
  if (req.method === 'OPTIONS') {
    console.log("   ✅ CORS preflight request");
  }
  next();
});

// ✅ Cookie Parser
app.use(cookieParser());

// ✅ Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Jaihind Sports API running successfully",
    version: "2.0.0",
  });
});

// 🔍 Status check route
app.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    jwtSecret: process.env.JWT_SECRET || "NOT SET - Using fallback"
  });
});

// ✅ 404 Handler
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port: ${PORT}`));

// ✅ Unhandled Rejection Handler
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION:", err);
  process.exit(1);
});

// ✅ Uncaught Exception Handler
process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});
