import Product from "../models/Product.js";

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (err) {
    console.error("Get Products Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Add new product
export const addProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock, imageUrl } = req.body;

    if (!name || !category || !price || !stock) {
      return res.status(400).json({
        success: false,
        message: "Name, Category, Price and Stock are required",
      });
    }

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : imageUrl;

    const product = await Product.create({
      name,
      category,
      description,
      price,
      stock,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });

  } catch (err) {
    console.error("Add Product Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock, imageUrl } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : imageUrl;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, description, price, stock, image },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (err) {
    console.error("Update Product Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (err) {
    console.error("Delete Product Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
