import Product from "../models/Product.js";
import { notifyLowStock, notifyOutOfStock } from "./notificationController.js";

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    console.log("🛒 GET /api/products - Fetching all products...");
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${products.length} products`);
    return res.json({ success: true, products });
  } catch (err) {
    console.error("❌ Get Products Error:", err.message);
    return res.status(500).json({ success: false, message: "Server Error: " + err.message });
  }
};

// ✅ Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (err) {
    console.error("Get Products By Category Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Add new product
export const addProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock, imageUrl, hasSizes, sizes } = req.body;

    if (!name || !category || !price || !stock) {
      return res.status(400).json({
        success: false,
        message: "Name, Category, Price and Stock are required",
      });
    }

    console.log("📸 File details:", {
      hasFile: !!req.file,
      fileName: req.file?.filename,
      fileSize: req.file?.size,
      secureUrl: req.file?.secure_url,
      path: req.file?.path,
    });
    
    // ✅ Prioritize Cloudinary secure_url for production, fallback to path
    const image = req.file
      ? (req.file.secure_url || req.file.path)  // Cloudinary returns secure_url
      : imageUrl;
    
    console.log("🖼️  Image URL resolved to:", image);
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Product image is required (upload file or provide URL)",
      });
    }

    const productData = {
      name,
      category,
      description,
      price,
      stock,
      image,
      hasSizes: hasSizes === "true" || hasSizes === true,
    };

    // If product has sizes, parse and validate them
    if (productData.hasSizes && sizes) {
      try {
        const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
        productData.sizes = parsedSizes;
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid sizes format",
        });
      }
    }

    const product = await Product.create(productData);

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
    const { name, category, description, price, stock, imageUrl, hasSizes, sizes } = req.body;

    console.log("📸 Update file details:", {
      hasFile: !!req.file,
      fileName: req.file?.filename,
      secureUrl: req.file?.secure_url,
      path: req.file?.path,
    });
    
    // ✅ Only update image if a new file is provided or imageUrl is provided
    const image = req.file
      ? (req.file.secure_url || req.file.path)  // Cloudinary returns secure_url
      : imageUrl || undefined;

    const updateData = {
      name,
      category,
      description,
      price,
      stock,
      hasSizes: hasSizes === "true" || hasSizes === true,
    };

    // Only update image if provided
    if (image) {
      updateData.image = image;
    }

    // If product has sizes, parse and validate them
    if (updateData.hasSizes && sizes) {
      try {
        const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
        updateData.sizes = parsedSizes;
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid sizes format",
        });
      }
    } else if (!updateData.hasSizes) {
      updateData.sizes = [];
    }

    // Get old product to check stock changes
    const oldProduct = await Product.findById(req.params.id);
    if (!oldProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // ✅ TRIGGER NOTIFICATIONS ON STOCK CHANGE
    if (stock !== undefined && oldProduct.stock !== stock) {
      if (stock <= 5 && stock > 0) {
        console.log("📢 Low stock alert triggered for:", updatedProduct.name);
        await notifyLowStock(updatedProduct);
      } else if (stock === 0) {
        console.log("📢 Out of stock alert triggered for:", updatedProduct.name);
        await notifyOutOfStock(updatedProduct);
      }
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

// ✅ Update size stock
export const updateSizeStock = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    if (!productId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID, Size, and Quantity are required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Find and update the size
    const sizeIndex = product.sizes.findIndex(s => s.size === size);
    if (sizeIndex === -1) {
      return res.status(404).json({ success: false, message: "Size not found" });
    }

    product.sizes[sizeIndex].quantity = quantity;
    
    // Update total stock
    product.stock = product.sizes.reduce((sum, s) => sum + s.quantity, 0);
    
    await product.save();

    return res.json({
      success: true,
      message: "Size stock updated successfully",
      product,
    });

  } catch (err) {
    console.error("Update Size Stock Error:", err);
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
