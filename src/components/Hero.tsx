import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-sports.jpg";
import { adminAPI } from "@/lib/api";

const Hero = () => {
  const [stats, setStats] = useState({ products: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ Fetch public stats from backend using consistent API
        const res = await adminAPI.getStats();
        console.log("📊 Stats response:", res.data);
        
        const data = res.data as any;
        if (data?.success) {
          setStats({
            products: data.stats?.products || 0,
            users: data.stats?.users || 0,
          });
          console.log("📦 Stats updated - Products:", data.stats?.products, "Users:", data.stats?.users);
        }
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
        // Fallback: Still fetch products at least
        try {
          const prodRes = await fetch(`${window.location.origin.includes('localhost') ? 'http://localhost:5000' : 'https://jaihind-sporty-spark-backend.onrender.com'}/api/products`);
          const prodData = await prodRes.json();
          const productsCount = prodData?.products?.length || 0;
          console.log("📦 Fallback - Products fetched:", productsCount);
          setStats({ products: productsCount, users: 0 });
        } catch (fallbackErr) {
          console.error("❌ Fallback also failed:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <img
          src={heroImage}
          alt="Sports Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-90" />
      </div>

      {/* Floating circles */}
      <motion.div 
        animate={{ y: [0, -20, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-5 sm:right-20 w-14 sm:w-20 h-14 sm:h-20 bg-secondary/20 rounded-full blur-xl"
      />
      <motion.div 
        animate={{ y: [0, 20, 0] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-24 sm:bottom-32 left-6 sm:left-16 w-24 sm:w-32 h-24 sm:h-32 bg-primary/20 rounded-full blur-xl"
      />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 z-10 flex justify-center py-12 sm:py-0">
        <div className="max-w-3xl flex flex-col items-center text-center">

          {/* Stars */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-2 mb-4"
          >
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-secondary text-secondary" />
              ))}
            </div>
            <span className="text-white/90 text-sm sm:text-base font-medium">
              Trusted by athletes
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 sm:mb-6"
          >
            Gear Up for{" "}
            <span className="block">
              <motion.span
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-gradient-to-r from-secondary via-primary to-secondary bg-[length:200%_100%] bg-clip-text text-transparent"
              >
                Victory
              </motion.span>
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 }}
            className="text-base sm:text-lg text-white/90 max-w-xl mb-6 sm:mb-8"
          >
            Discover premium sports equipment designed for champions.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Link to="/products" className="w-full sm:w-auto">
              <Button className="btn-hero w-full text-base sm:text-lg px-8 py-4 rounded-full group flex items-center justify-center">
                Shop Now
                <ArrowRight className="ml-2 sm:ml-3 group-hover:translate-x-1 transition" />
              </Button>
            </Link>

            <Button 
              className="btn-hero w-full sm:w-auto text-base sm:text-lg px-8 py-4 rounded-full group flex items-center justify-center"
            >
              <Play className="mr-2" /> Watch Video
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1 }}
            className="grid grid-cols-2 gap-6 sm:gap-10 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20"
          >
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.products}+</div>
              <div className="text-white/80 text-xs sm:text-sm">Quality Products</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.users}+</div>
              <div className="text-white/80 text-xs sm:text-sm">Happy Users</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
