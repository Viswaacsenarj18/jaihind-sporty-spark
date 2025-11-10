import Order from "../models/Order.js";

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod, summary } = req.body;

    if (!customer?.firstName || !customer?.email || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    // Normalize items (frontend uses 'id', backend expects 'productId')
    const normalizedItems = items.map(item => ({
      productId: item.productId || item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity
    }));

    const newOrder = await Order.create({
      customer,
      items: normalizedItems,
      paymentMethod,
      summary,
      status: "Pending"
    });

    return res.status(201).json({ success: true, order: newOrder });

  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ success: false, message: "Server error while creating order" });
  }
};

// ✅ GET ALL ORDERS (ADMIN)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error("getAllOrders error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// ✅ GET USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ "customer.userId": id }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("getUserOrders error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch user orders" });
  }
};

// ✅ DELETE ORDER (ADMIN)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted successfully" });

  } catch (err) {
    console.error("deleteOrder error:", err);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};

// ✅ UPDATE ORDER STATUS (ADMIN)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Pending / Shipped / Delivered / Cancelled

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order: updated });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};
