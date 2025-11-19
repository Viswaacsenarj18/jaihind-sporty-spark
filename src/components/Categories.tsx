// src/components/home/Categories.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

const BasketballIcon = Volleyball; // using Volleyball as Basketball icon


const categories = [
  {
    id: 1,
    name: "T-Shirts & Apparel",
    icon: Shirt,
    description: "Sports jerseys, shorts & activewear.",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80",
    slug: "t-shirts-apparel",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    id: 2,
    name: "Cricket",
    icon: Circle,
    description: "Bats, pads, balls & wear.",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80",
    slug: "cricket",
    gradient: "from-green-500 to-green-700",
  },
  {
    id: 3,
    name: "Badminton",
    icon: Wind,
    description: "Rackets, shuttlecocks & wear.",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
    slug: "badminton",
    gradient: "from-yellow-400 to-yellow-600",
  },
  {
    id: 4,
    name: "Kabaddi",
    icon: Users,
    description: "Kabaddi mats & shoes.",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80",
    slug: "kabaddi",
    gradient: "from-orange-500 to-orange-700",
  },
  {
    id: 5,
    name: "Football",
    icon: Target,
    description: "Football boots, balls & wear.",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80",
    slug: "football",
    gradient: "from-red-500 to-red-700",
  },

  /* ✅ Volleyball */
  {
    id: 6,
    name: "Volleyball",
    icon: Volleyball,
    description: "Volleyballs, nets & wear.",
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
    slug: "volleyball",
    gradient: "from-purple-500 to-purple-700",
  },

  /* 🏀 FIXED: Basketball Image */
  {
    id: 7,
    name: "Basketball",
    icon: BasketballIcon,
    description: "Basketballs, court wear & accessories.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
    slug: "basketball",
    gradient: "from-orange-600 to-orange-800",
  },

  /* 🎮 FIXED: Indoor Games Image */
  {
    id: 8,
    name: "Indoor Games",
    icon: Gamepad2,
    description: "Carrom, chess & indoor games.",
    image: "https://plus.unsplash.com/premium_photo-1664302012799-8da4258711a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kb29yJTIwZ2FtZXN8ZW58MHx8MHx8fDA%3D",
    slug: "indoor-games",
    gradient: "from-indigo-500 to-indigo-700",
  },

  {
    id: 9,
    name: "Gym & Fitness",
    icon: Dumbbell,
    description: "Dumbbells, gym wear & accessories.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    slug: "gym-fitness",
    gradient: "from-pink-500 to-pink-700",
  },

  /* 🏆 FIXED: Trophies */
  {
    id: 10,
    name: "Trophies",
    icon: Trophy,
    description: "Awards, cups & medals.",
    image: "https://media.istockphoto.com/id/108353971/photo/trophy.webp?a=1&b=1&s=612x612&w=0&k=20&c=DCSBY2WdcLCblHHSNpzmapItigixJdQvV7VnvqgpPgU=",
    slug: "trophies",
    gradient: "from-yellow-500 to-yellow-700",
  },

  {
    id: 11,
    name: "Other Sports",
    icon: Trophy,
    description: "All other sports wear & accessories.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    slug: "other-sports",
    gradient: "from-teal-500 to-teal-700",
  },
];


const Categories = () => {
  return (
    <section className="py-12 px-4 bg-muted/20">
      <div className="container mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-blue-600">
            Shop by Category
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Explore premium sports wear across categories
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((cat, index) => {
            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={`/products?category=${cat.slug}`}>
                  <div className="group overflow-hidden rounded-lg shadow bg-card hover:shadow-xl transition cursor-pointer">

                    {/* Image */}
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />

                      <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-50`} />

                      <div className="absolute top-2 right-2 bg-white/30 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center">
                        <Icon className="text-white w-4 h-4" />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="p-3">
                      <h3 className="text-sm font-semibold group-hover:text-primary">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {cat.description}
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
