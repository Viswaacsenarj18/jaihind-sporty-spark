import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    // Who the notification is for
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional: who triggered it (user/admin)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Related order
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Category of notification
    type: {
      type: String,
      enum: [
        "order_created",     // User placed order → admin gets notification
        "status_updated",    // Admin updated order status → user gets notification
        "shipped",
        "delivered",
        "cancelled"
      ],
      required: true,
    },

    // Title shown in UI
    title: {
      type: String,
      required: true,
    },

    // Message shown in UI
    message: {
      type: String,
      required: true,
    },

    // Read status
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
