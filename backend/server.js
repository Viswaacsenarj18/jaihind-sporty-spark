import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Load environment variables
dotenv.config();

// Path setup (for ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Database Connection
connectDB();

// ✅ CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:5173", 
    "http://localhost:3000",
    "http://localhost:8080"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static file serving for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API ROUTES
app.use("/api/auth", authRoutes);       // User Auth + Admin login
app.use("/api/admin", adminRoutes);     // Admin protected actions
app.use("/api/products", productRoutes); // Products CRUD

// ✅ Root Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🏏 Jaihind Sports API running successfully!",
    version: "1.0.0"
  });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
