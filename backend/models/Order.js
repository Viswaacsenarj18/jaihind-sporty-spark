import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.Mixed, required: true }, // string or ObjectId
  name: String,
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  customer: {
    userId: { type: String }, // optional if you allow guest checkout
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  items: [ItemSchema],
  paymentMethod: { type: String, default: "Cash on Delivery" },
  summary: {
    subtotal: Number,
    shipping: Number,
    total: Number,
  },
  status: { type: String, default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
