import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Admin from "../models/Admin.js";

dotenv.config();

const checkDatabase = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected\n");

    // Check Categories
    const categoryCount = await Category.countDocuments();
    console.log(`📂 Categories in Database: ${categoryCount}`);
    if (categoryCount > 0) {
      const categories = await Category.find().sort({ displayOrder: 1 }).select("name slug");
      categories.forEach((cat, i) => {
        console.log(`   ${i + 1}. ${cat.name} (${cat.slug})`);
      });
    }

    // Check Products
    const productCount = await Product.countDocuments();
    console.log(`\n🛒 Products in Database: ${productCount}`);

    // Check Admins
    const adminCount = await Admin.countDocuments();
    console.log(`\n👨‍💼 Admins in Database: ${adminCount}`);

    console.log("\n" + "=".repeat(50));
    console.log("📊 NEXT STEPS:");
    console.log("=".repeat(50));

    if (categoryCount === 0) {
      console.log("❌ No categories found!");
      console.log("   Run: npm run seed:categories");
    } else {
      console.log("✅ Categories loaded successfully!");
    }

    if (adminCount === 0) {
      console.log("❌ No admin found!");
      console.log("   Run: npm run seed:admin");
    } else {
      console.log("✅ Admin account exists!");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Database Check Error:", error.message);
    process.exit(1);
  }
};

checkDatabase();
