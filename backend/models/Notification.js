import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    // Who receives the notification
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,   // admin notifications do NOT need receiver
    },

    // Who triggered it (User or Admin)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Related order (optional for stock notifications)
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // Type of notification
    type: {
      type: String,
      enum: [
        "order_created",     // User placed order → Admin gets notification
        "status_updated",    // Admin updated order status → User gets notification

        "low_stock",         // Product low stock alert
        "out_of_stock",      // Product zero stock alert

        // Order lifecycle events (optional future use)
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ],
      required: true,
    },

    // Notification title
    title: {
      type: String,
      required: true,
    },

    // Notification message
    message: {
      type: String,
      required: true,
    },

    // If user/admin has read it
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
