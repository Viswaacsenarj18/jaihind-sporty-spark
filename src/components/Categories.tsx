import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Trophy, 
  Dumbbell, 
  Shirt, 
  Circle,
  Award
} from "lucide-react";

// Category data
const categories = [
  {
    id: 1,
    name: "Sports Shoes",
    icon: ShoppingBag,
    description: "Performance footwear for every sport",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    link: "/products?category=shoes",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    name: "Cricket & Bats",
    icon: Circle,
    description: "Premium cricket equipment",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop",
    link: "/products?category=cricket",
    gradient: "from-green-500 to-green-600"
  },
  {
    id: 3,
    name: "Balls & Equipment",
    icon: Circle,
    description: "Quality gear for all sports",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=400&fit=crop",
    link: "/products?category=equipment",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    id: 4,
    name: "Gym Equipment",
    icon: Dumbbell,
    description: "Build strength with pro gear",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
    link: "/products?category=gym",
    gradient: "from-red-500 to-red-600"
  },
  {
    id: 5,
    name: "Sports Apparel",
    icon: Shirt,
    description: "Comfortable performance wear",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
    link: "/products?category=apparel",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    id: 6,
    name: "Trophies & Awards",
    icon: Award,
    description: "Celebrate your victories",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=400&fit=crop",
    link: "/products?category=trophies",
    gradient: "from-yellow-500 to-yellow-600"
  }
];

const Categories = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Find Your Perfect Gear
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Welcome to your ultimate sports destination! Explore our carefully curated collection 
            featuring Sports Shoes, Cricket & Bats, Balls & Equipment, Gym Equipment, Sports Apparel, 
            and Trophies & Awards. Each category offers premium quality products designed to elevate 
            your performance and celebrate your achievements. Discover the variety that matches your passion!
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={category.link}>
                  <div className="group relative overflow-hidden rounded-2xl bg-card shadow-card hover-lift cursor-pointer h-full">
                    {/* Image Background */}
                    <div className="aspect-square overflow-hidden relative">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
                      
                      {/* Icon */}
                      <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-card">
                      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
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
