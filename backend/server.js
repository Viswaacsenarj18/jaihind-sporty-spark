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
connectDB();

// Allow cookies & proxies
app.set("trust proxy", 1);

// =========================
// CORS CONFIG
// =========================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://jaihind-sporty-spark.vercel.app",
  "https://jaihind-sporty-spark-viswaacsenars-projects.vercel.app",
  "http://jaihindsportsfit.in",
  "https://jaihindsportsfit.in",
  "http://www.jaihindsportsfit.in",
  "https://www.jaihindsportsfit.in",
  "http://jaihindsports.in",
  "https://jaihindsports.in",
  "http://www.jaihindsports.in",
  "https://www.jaihindsports.in"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith("vercel.app") ||
      origin.includes("localhost")
    ) {
      return callback(null, true);
    }

    console.warn("❌ CORS BLOCKED:", origin);
    return callback(new Error("Blocked by CORS"));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contact", contactRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend running successfully 📦",
    timestamp: new Date().toISOString(),
  });
});

// API HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy ✅",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ success: false, message: err.message });
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));
