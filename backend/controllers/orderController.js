import Order from "../models/Order.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod, summary } = req.body;

    if (!customer?.firstName || !customer?.email || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    const normalizedItems = items.map((item) => ({
      productId: item.productId || item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      customer,
      items: normalizedItems,
      paymentMethod,
      summary,
      status: "Pending",
    });

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Order Create Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load orders" });
  }
};

// GET USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "customer.userId": req.params.id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load orders" });
  }
};

// ✅ UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};
