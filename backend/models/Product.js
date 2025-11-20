import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String },
    // Size variant tracking (for T-shirts, Apparel, etc.)
    sizes: [
      {
        size: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"], required: true },
        quantity: { type: Number, required: true, default: 0 },
      }
    ],
    // Check if product has size variants
    hasSizes: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
  