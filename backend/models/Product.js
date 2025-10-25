import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
