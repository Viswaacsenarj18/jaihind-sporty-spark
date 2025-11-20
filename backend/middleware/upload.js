import multer from "multer";
import path from "path";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("☁️  Cloudinary configured with cloud name:", process.env.CLOUDINARY_CLOUD_NAME);

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "jaihind-sports",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "avif", "bmp", "svg"],
  },
});

// Wrap multer with logging
export const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    console.log("📤 File received:", file.originalname);
    cb(null, true);
  }
});

// Add hook to log upload result
const originalSingle = upload.single;
upload.single = function(fieldName) {
  const middleware = originalSingle.call(this, fieldName);
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err) {
        console.error("❌ Upload error:", err);
        return next(err);
      }
      if (req.file) {
        console.log("✅ File uploaded to Cloudinary:");
        console.log("   Filename:", req.file.filename);
        console.log("   Path:", req.file.path);
        console.log("   Secure URL:", req.file.secure_url);
        console.log("   All properties:", Object.keys(req.file));
      }
      next();
    });
  };
};

export default upload;
