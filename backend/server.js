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
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

// Fix path issue (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// -------------------------
// DB CONNECTION
// -------------------------
connectDB();

// Allow cookies & proxies (important for Render / HTTPS)
app.set("trust proxy", 1);

// =========================
// ✅ CORS CONFIG (FINAL FIX)
// =========================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",

  "https://jaihind-sporty-spark.vercel.app",
  "https://jaihind-sporty-spark-viswaacsenars-projects.vercel.app",

  "https://jaihindsportsfit.in",
  "https://www.jaihindsportsfit.in",

  "https://jaihindsports.in",
  "https://www.jaihindsports.in",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow Postman, server-to-server, Render health checks
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      origin.includes("localhost")
    ) {
      return callback(null, true);
    }

    console.warn("❌ CORS BLOCKED:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 🔥 APPLY CORS (VERY IMPORTANT ORDER)
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Preflight handler

// -------------------------
// BODY PARSERS
// -------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -------------------------
// STATIC FILES
// -------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------------
// ROUTES
// -------------------------
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contact", contactRoutes);

// -------------------------
// TEST ROUTES
// -------------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend running successfully 📦",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy ✅",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// -------------------------
// GLOBAL ERROR HANDLER
// -------------------------
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
