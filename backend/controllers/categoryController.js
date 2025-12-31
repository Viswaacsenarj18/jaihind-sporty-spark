import Category from "../models/Category.js";
import Product from "../models/Product.js";

// ✅ Get all categories
export const getCategories = async (req, res) => {
  try {
    console.log("📂 GET /api/categories - Fetching all categories...");
    const categories = await Category.find().sort({ displayOrder: 1 });
    console.log(`✅ Found ${categories.length} categories`);
    return res.json({ success: true, categories });
  } catch (err) {
    console.error("❌ Get Categories Error:", err.message);
    return res.status(500).json({ success: false, message: "Server Error: " + err.message });
  }
};

// ✅ Get single category
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    return res.json({ success: true, category });
  } catch (err) {
    console.error("Get Category Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Add new category
export const addCategory = async (req, res) => {
  try {
    const { name, slug, description, icon, gradient, hasSizes, imageUrl } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and Slug are required",
      });
    }

    // Check if category already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category with this slug already exists",
      });
    }

    console.log("📸 Add request received");
    console.log("📸 File uploaded:", req.file);
    console.log("📸 Body data:", { name, slug, description, icon, gradient, hasSizes, imageUrl });
    
    let image = "";
    
    // Priority: uploaded file > URL input
    if (req.file) {
      image = req.file.secure_url || req.file.path;
      console.log("🖼️  Using uploaded file - Cloudinary URL:", image);
    } else if (imageUrl) {
      // Handle both string and array cases
      image = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
      console.log("🖼️  Using URL input:", image);
    }
    
    if (!image) {
      console.warn("⚠️  No image provided");
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image: image || "", // Ensure it's a string, not an array
      icon,
      gradient,
      hasSizes: hasSizes === "true" || hasSizes === true,
    });

    console.log("✅ Category created:", category);

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });

  } catch (err) {
    console.error("❌ Add Category Error:", err);
    console.error("❌ Error message:", err.message);
    console.error("❌ Error stack:", err.stack);
    return res.status(500).json({ success: false, message: "Server Error: " + err.message });
  }
};

// ✅ Update category
export const updateCategory = async (req, res) => {
  try {
    const { name, slug, description, icon, gradient, hasSizes, imageUrl } = req.body;

    console.log("📸 Update request received");
    console.log("📸 File uploaded:", req.file);
    console.log("📸 Body data:", { name, slug, description, icon, gradient, hasSizes, imageUrl });
    
    let image = "";
    
    // Priority: uploaded file > URL input
    if (req.file) {
      image = req.file.secure_url || req.file.path;
      console.log("🖼️  Using uploaded file - Cloudinary URL:", image);
    } else if (imageUrl) {
      // Handle both string and array cases
      image = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
      console.log("🖼️  Using URL input:", image);
    }
    
    if (!image) {
      console.warn("⚠️  No image provided - keeping existing image");
    }

    // Check if slug is being changed and if new slug already exists
    if (slug) {
      const existing = await Category.findOne({ 
        slug,
        _id: { $ne: req.params.id }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Category with this slug already exists",
        });
      }
    }

    const updateData = { 
      name, 
      slug, 
      description, 
      icon,
      gradient,
      hasSizes: hasSizes === "true" || hasSizes === true,
    };
    
    // Only update image if a new one was provided
    if (image) {
      updateData.image = image;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    console.log("✅ Category updated:", updatedCategory);

    return res.json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });

  } catch (err) {
    console.error("❌ Update Category Error:", err);
    console.error("❌ Error message:", err.message);
    console.error("❌ Error stack:", err.stack);
    return res.status(500).json({ success: false, message: "Server Error: " + err.message });
  }
};

// ✅ Delete category
export const deleteCategory = async (req, res) => {
  try {
    // Check if any products use this category
    const productsCount = await Product.countDocuments({ category: req.params.id });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productsCount} product(s) are using this category.`,
      });
    }

    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (err) {
    console.error("Delete Category Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
