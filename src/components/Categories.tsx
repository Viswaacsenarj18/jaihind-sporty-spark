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
  BallBasketball
} from "lucide-react";



// ✅ Category data
const categories = [
 {
  id: 1,
  name: "T-Shirts & Apparel",
  icon: Shirt,
  description: "Sports jerseys, shorts & activewear.",
  image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80",
  slug: "t-shirts-apparel",   // ✅ FIXED
  gradient: "from-blue-500 to-blue-600"
},

  {
    id: 2,
    name: "Cricket",
    icon: Circle,
    description: "Bats, pads, balls & gear.",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80",
    slug: "cricket",
    gradient: "from-green-500 to-green-600"
  },
  {
    id: 3,
    name: "Badminton",
    icon: Wind,
    description: "Rackets, shuttlecocks & kits.",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80",
    slug: "badminton",
    gradient: "from-yellow-500 to-yellow-600"
  },
  {
    id: 4,
    name: "Kabaddi",
    icon: Users,
    description: "Kabaddi mats & shoes.",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80",
    slug: "kabaddi",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    id: 5,
    name: "Football",
    icon: Target,
    description: "Football boots & balls.",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80",
    slug: "football",
    gradient: "from-red-500 to-red-600"
  },
  {
    id: 6,
    name: "Volleyball",
    icon: Volleyball,
    description: "Volleyballs & nets.",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80",
    slug: "volleyball",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    id: 7,
    name: "Basketball",
    icon: Basketball,
    description: "Basketballs & court gear.",
    image: "https://images.unsplash.com/photo-1521417531039-5a88fb2446f0?w=600&q=80",
    slug: "basketball",
    gradient: "from-orange-600 to-orange-800"
  },
  {
    id: 8,
    name: "Indoor Games",
    icon: Gamepad2,
    description: "Carrom, chess, ludo boards.",
    image: "https://images.unsplash.com/photo-1611891487183-17d959f29e4e?w=600&q=80",
    slug: "indoor-games",
    gradient: "from-indigo-500 to-indigo-600"
  },
  {
    id: 9,
    name: "Gym & Fitness",
    icon: Dumbbell,
    description: "Dumbbells & strength gear.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    slug: "gym-fitness",
    gradient: "from-pink-500 to-pink-600"
  },
  {
    id: 10,
    name: "Trophies",
    icon: Trophy,
    description: "Awards, cups & medals.",
    image: "https://images.unsplash.com/photo-1607922506368-8c472a06380c?w=600&q=80",
    slug: "trophies",
    gradient: "from-yellow-500 to-yellow-700"
  },
  {
    id: 11,
    name: "Other Sports",
    icon: Trophy,
    description: "All other sports accessories.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
    slug: "other-sports",
    gradient: "from-teal-500 to-teal-600"
  }
];

const Categories = () => {
  return (
    <section className="py-12 px-4 bg-muted/20">
      <div className="container mx-auto">

        {/* Title */}
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
            Explore premium sports wear & categories
          </p>
        </motion.div>

        {/* ✅ 5 column grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={`/products?category=${category.slug}`}>
                  <div className="group overflow-hidden rounded-lg shadow bg-card hover:shadow-xl transition cursor-pointer">
                    
                    {/* Image */}
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-50`} />
                      <div className="absolute top-2 right-2 bg-white/30 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center">
                        <Icon className="text-white w-4 h-4" />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="p-3">
                      <h3 className="text-sm font-semibold group-hover:text-primary">
                        {category.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {category.description}
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
