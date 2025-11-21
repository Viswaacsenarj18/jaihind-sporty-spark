import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    pastOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        category: String,
      },
    ],
  },
  { 
    timestamps: true // ✅ Auto adds createdAt & updatedAt
  }
);

// ✅ Prevent model overwrite issue in dev
export default mongoose.models.User || mongoose.model("User", userSchema);
