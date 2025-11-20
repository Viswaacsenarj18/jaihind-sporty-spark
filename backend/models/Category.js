import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true 
    },
    description: { type: String },
    image: { type: String }, // Cloudinary URL or local file path
    icon: { type: String }, // Icon name for display
    gradient: { type: String, default: "from-blue-500 to-blue-700" },
    displayOrder: { type: Number, default: 0 },
    // Categories with apparel/clothing items can have sizes
    hasSizes: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
