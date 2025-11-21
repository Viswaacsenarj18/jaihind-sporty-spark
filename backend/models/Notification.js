import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "order_created",
        "status_updated",
        "low_stock",
        "out_of_stock",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      required: true,
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
