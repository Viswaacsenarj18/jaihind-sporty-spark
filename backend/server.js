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

// Load env
dotenv.config();

// Fix ES module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//========================================
// 🔌 CONNECT DATABASE
//========================================
connectDB();

// Required for cookies
app.set("trust proxy", 1);

//========================================
// 🌐 CORS (Stable + Works for all Vercel URLs)
//========================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://jaihind-sporty-spark.vercel.app",
  "https://jaihind-sporty-spark-viswaacsenars-projects.vercel.app",
];

// Any Vercel preview deployment (*.vercel.app)
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

    console.warn("❌ CORS blocked:", origin);
    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight

//========================================
// 📡 MIDDLEWARES
//========================================
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//========================================
// 🛣 API ROUTES
//========================================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

//========================================
// 🧪 Test Routes
//========================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Jaihind Sports API running successfully",
    version: "2.0.0",
  });
});

app.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  });
});

//========================================
// ❌ 404 Handler
//========================================
app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
);

//========================================
// 🔥 GLOBAL ERROR HANDLER
//========================================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

//========================================
// 🚀 START SERVER
//========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

//========================================
// SAFETY HANDLERS
//========================================
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err);
});
