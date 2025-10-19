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
  Trophy
} from "lucide-react";

// Category data
const categories = [
  {
    id: 1,
    name: "T-Shirts & Apparel",
    icon: Shirt,
    description: "Dress for success! Explore jerseys, sublimation tees, shorts, tights, and swimwear for every sport.",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
    link: "/products?category=apparel",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    name: "Cricket",
    icon: Circle,
    description: "Master the pitch! Shop cricket bats, balls, pads, and all essential equipment for champions.",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop",
    link: "/products?category=cricket",
    gradient: "from-green-500 to-green-600"
  },
  {
    id: 3,
    name: "Badminton",
    icon: Wind,
    description: "Smash your way to victory! Find premium badminton racquets and shuttlecocks here.",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=400&fit=crop",
    link: "/products?category=badminton",
    gradient: "from-yellow-500 to-yellow-600"
  },
  {
    id: 4,
    name: "Kabaddi",
    icon: Users,
    description: "Raid with confidence! Get kabaddi sets and specialized shoes for pro-level performance.",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=400&fit=crop",
    link: "/products?category=kabaddi",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    id: 5,
    name: "Football",
    icon: Target,
    description: "Score big! Browse top-quality football shoes and balls for every player.",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=400&fit=crop",
    link: "/products?category=football",
    gradient: "from-red-500 to-red-600"
  },
  {
    id: 6,
    name: "Volleyball & Basketball",
    icon: Volleyball,
    description: "Spike and dunk in style! Discover volleyballs and basketballs built for the game.",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop",
    link: "/products?category=ball-sports",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    id: 7,
    name: "Other Sports",
    icon: Trophy,
    description: "Expand your game! Check out tennikoit rings, skipping ropes, and more unique sports gear.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop",
    link: "/products?category=other-sports",
    gradient: "from-teal-500 to-teal-600"
  },
  {
    id: 8,
    name: "Indoor Games",
    icon: Gamepad2,
    description: "Family fun awaits! Explore carrom boards, chess sets, and all the pieces you need.",
    image: "https://images.unsplash.com/photo-1611891487183-17d959f29e4e?w=400&h=400&fit=crop",
    link: "/products?category=indoor-games",
    gradient: "from-indigo-500 to-indigo-600"
  },
  {
    id: 9,
    name: "Gym & Fitness",
    icon: Dumbbell,
    description: "Build strength at home! Shop gym equipment, athletic shoes, and skates for peak fitness.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
    link: "/products?category=gym-fitness",
    gradient: "from-pink-500 to-pink-600"
  }
];

const Categories = () => {
  return (
    <section className="py-12 px-4 bg-muted/20">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Find Your Perfect Gear
          </h2>
          <p className="text-sm md:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Welcome to Jaihind Sportify, your one-stop destination for premium sports gear! From cricket bats to gym equipment, apparel to indoor games—discover quality products that fuel your passion and elevate every game.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={category.link}>
                  <div className="group relative overflow-hidden rounded-lg bg-card shadow-card hover-lift cursor-pointer h-full">
                    {/* Image Background */}
                    <div className="aspect-square overflow-hidden relative">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                      />
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-50 group-hover:opacity-60 transition-opacity`} />
                      
                      {/* Icon */}
                      <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 bg-card">
                      <h3 className="text-md font-semibold mb-1 text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category.description}
                      </p>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none" />
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
