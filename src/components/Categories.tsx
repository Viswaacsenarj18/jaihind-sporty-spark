// src/components/home/Categories.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  Shirt,
  Circle,
  Wind,
  Users,
  Target,
  Volleyball,
  Gamepad2,
  Dumbbell,
  Trophy,
} from "lucide-react";

import { API_BASE_URL, CATEGORY_ROUTES } from "@/config/api";

/* -------------------------------------------------------
   STATIC DEFAULT CATEGORIES (NO GRADIENTS)
------------------------------------------------------- */
const DEFAULT_CATEGORIES = [
  {
    _id: "1",
    name: "T-Shirts & Apparel",
    icon: "Shirt",
    description: "Sports jerseys, shorts & activewear.",
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80",
    slug: "t-shirts-apparel",
  },
  {
    _id: "2",
    name: "Cricket",
    icon: "Circle",
    description: "Bats, pads, balls & wear.",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80",
    slug: "cricket",
  },
  {
    _id: "3",
    name: "Badminton",
    icon: "Wind",
    description: "Rackets, shuttlecocks & wear.",
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
    slug: "badminton",
  },
  {
    _id: "4",
    name: "Kabaddi",
    icon: "Users",
    description: "Kabaddi mats & shoes.",
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80",
    slug: "kabaddi",
  },
  {
    _id: "5",
    name: "Football",
    icon: "Target",
    description: "Football boots, balls & wear.",
    image:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80",
    slug: "football",
  },
  {
    _id: "6",
    name: "Volleyball",
    icon: "Volleyball",
    description: "Volleyballs, nets & wear.",
    image:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
    slug: "volleyball",
  },
  {
    _id: "7",
    name: "Basketball",
    icon: "Volleyball",
    description: "Basketballs, court wear & accessories.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
    slug: "basketball",
  },
  {
    _id: "8",
    name: "Indoor Games",
    icon: "Gamepad2",
    description: "Carrom, chess & indoor games.",
    image:
      "https://plus.unsplash.com/premium_photo-1664302012799-8da4258711a3?w=500&auto=format&fit=crop&q=60",
    slug: "indoor-games",
  },
  {
    _id: "9",
    name: "Gym & Fitness",
    icon: "Dumbbell",
    description: "Dumbbells, gym wear & accessories.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    slug: "gym-fitness",
  },
  {
    _id: "10",
    name: "Trophies",
    icon: "Trophy",
    description: "Awards, cups & medals.",
    image:
      "https://media.istockphoto.com/id/108353971/photo/trophy.webp?a=1&b=1&s=612x612&w=0&k=20",
    slug: "trophies",
  },
  {
    _id: "11",
    name: "Other Sports",
    icon: "Trophy",
    description: "All other sports wear & accessories.",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    slug: "other-sports",
  },
];

/* -------------------------------------------------------
   ICON MAPPING
------------------------------------------------------- */
const ICON_MAP: Record<string, any> = {
  Shirt,
  Circle,
  Wind,
  Users,
  Target,
  Volleyball,
  Gamepad2,
  Dumbbell,
  Trophy,
};

const getIconComponent = (name: string) => ICON_MAP[name] || Shirt;

/* -------------------------------------------------------
   IMAGE RESOLVER
------------------------------------------------------- */
const resolveImg = (img?: string) => {
  if (!img) return DEFAULT_CATEGORIES[0].image;
  if (img.startsWith("http")) return img;
  return `${API_BASE_URL}${img}`;
};

/* -------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------- */
const Categories = () => {
  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(CATEGORY_ROUTES.GET_ALL);
        const data = await res.json();

        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (err: any) {
        setError("Unable to load categories");
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* Loading UI */
  if (loading)
    return (
      <section className="py-12 px-4 bg-muted/20">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </section>
    );

  return (
    <section className="py-12 px-4 bg-muted/20">
      <div className="container mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-blue-600">Shop by Category</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Explore premium sports wear across categories
          </p>
        </motion.div>

        {/* Error message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-sm text-yellow-700">
            Could not load categories from server. Showing defaults.
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((cat: any, index) => {
            const Icon = getIconComponent(cat.icon);

            return (
              <motion.div
                key={cat._id || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={`/products?category=${cat.slug}`}>
                  <div className="group overflow-hidden rounded-lg shadow bg-card hover:shadow-xl transition cursor-pointer h-full flex flex-col">

                    {/* Image */}
                    <div className="relative h-44 w-full overflow-hidden flex-shrink-0">
                      <img
                        src={resolveImg(cat.image)}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />

                      {/* Icon Bubble */}
                      <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="text-white w-4 h-4" />
                      </div>
                    </div>

                    {/* Text - Fixed Height */}
                    <div className="p-3 flex-grow flex flex-col">
                      <h3 className="text-sm font-semibold group-hover:text-primary line-clamp-2 mb-1">
                        {cat.name || "Unknown Category"}
                      </h3>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 flex-grow">
                        {cat.description || "Sports wear & accessories"}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
