import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
      userId: String
    },

    items: [
      {
        id: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number
      }
    ],

    paymentMethod: String,

    summary: {
      subtotal: Number,
      shipping: Number,
      total: Number
    },

    status: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
