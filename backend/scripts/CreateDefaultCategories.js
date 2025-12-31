import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";

dotenv.config();

const defaultCategories = [
  {
    name: "T-Shirts & Apparel",
    slug: "t-shirts-apparel",
    description: "Sports jerseys, shorts & activewear.",
    icon: "Shirt",
    gradient: "from-blue-400 to-blue-600",
    hasSizes: true,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80",
    displayOrder: 1,
  },
  {
    name: "Cricket",
    slug: "cricket",
    description: "Bats, pads, balls & wear.",
    icon: "Circle",
    gradient: "from-amber-400 to-orange-600",
    hasSizes: false,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80",
    displayOrder: 2,
  },
  {
    name: "Badminton",
    slug: "badminton",
    description: "Rackets, shuttlecocks & wear.",
    icon: "Wind",
    gradient: "from-green-400 to-green-600",
    hasSizes: false,
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
    displayOrder: 3,
  },
  {
    name: "Kabaddi",
    slug: "kabaddi",
    description: "Kabaddi mats & shoes.",
    icon: "Users",
    gradient: "from-red-400 to-red-600",
    hasSizes: true,
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80",
    displayOrder: 4,
  },
  {
    name: "Football",
    slug: "football",
    description: "Football boots, balls & wear.",
    icon: "Target",
    gradient: "from-yellow-400 to-yellow-600",
    hasSizes: true,
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80",
    displayOrder: 5,
  },
  {
    name: "Volleyball",
    slug: "volleyball",
    description: "Volleyballs, nets & wear.",
    icon: "Volleyball",
    gradient: "from-pink-400 to-rose-600",
    hasSizes: true,
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
    displayOrder: 6,
  },
  {
    name: "Basketball",
    slug: "basketball",
    description: "Basketballs, court wear & accessories.",
    icon: "Volleyball",
    gradient: "from-orange-400 to-orange-600",
    hasSizes: true,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
    displayOrder: 7,
  },
  {
    name: "Indoor Games",
    slug: "indoor-games",
    description: "Carrom, chess & indoor games.",
    icon: "Gamepad2",
    gradient: "from-purple-400 to-purple-600",
    hasSizes: false,
    image: "https://plus.unsplash.com/premium_photo-1664302012799-8da4258711a3?w=500&auto=format&fit=crop&q=60",
    displayOrder: 8,
  },
  {
    name: "Gym & Fitness",
    slug: "gym-fitness",
    description: "Dumbbells, yoga mats & equipment.",
    icon: "Dumbbell",
    gradient: "from-cyan-400 to-blue-600",
    hasSizes: false,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    displayOrder: 9,
  },
  {
    name: "Sports Accessories",
    slug: "sports-accessories",
    description: "Bags, shoes, socks & more.",
    icon: "Trophy",
    gradient: "from-lime-400 to-green-600",
    hasSizes: false,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    displayOrder: 10,
  },
];

const createDefaultCategories = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("✅ MongoDB Connected");

    // Check if categories already exist
    const categoryCount = await Category.countDocuments();
    if (categoryCount > 0) {
      console.log(`ℹ️ Categories already exist in database (${categoryCount} found).`);
      
      // Show existing categories
      const existingCategories = await Category.find().sort({ displayOrder: 1 });
      console.log("\n📂 Existing Categories:");
      existingCategories.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.name} (${cat.slug})`);
      });
      process.exit(0);
    }

    // Create default categories
    const created = await Category.insertMany(defaultCategories);
    console.log(`✅ ${created.length} default categories created successfully!\n`);
    
    console.log("📂 Created Categories:");
    created.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.name} (${cat.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating default categories:", error.message);
    process.exit(1);
  }
};

createDefaultCategories();
