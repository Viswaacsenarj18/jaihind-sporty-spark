import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

const Categories = () => {
  const categories = [
    {
      name: "T-Shirts & Apparel",
      slug: "apparel",
      description: "Jerseys, Tees & Athletic Wear",
      products: 156,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
      featured: true,
    },
    {
      name: "Cricket",
      slug: "cricket",
      description: "Bats, Balls, Pads & More",
      products: 128,
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600",
      featured: true,
    },
    {
      name: "Badminton",
      slug: "badminton",
      description: "Rackets, Shuttles, Shoes",
      products: 89,
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600",
      featured: false,
    },
    {
      name: "Kabaddi",
      slug: "kabaddi",
      description: "Sets, Shoes & Equipment",
      products: 95,
      image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600",
      featured: false,
    },
    {
      name: "Football",
      slug: "football",
      description: "Footballs, Boots, Jerseys",
      products: 73,
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600",
      featured: true,
    },
    {
      name: "Volleyball & Basketball",
      slug: "ball-sports",
      description: "Premium Balls for Court Sports",
      products: 142,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600",
      featured: false,
    },
    {
      name: "Other Sports",
      slug: "other-sports",
      description: "Tennikoit, Skipping & More",
      products: 198,
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600",
      featured: false,
    },
    {
      name: "Indoor Games",
      slug: "indoor-games",
      description: "Carrom, Chess & Board Games",
      products: 67,
      image: "https://images.unsplash.com/photo-1611891487183-17d959f29e4e?w=600",
      featured: false,
    },
    {
      name: "Gym & Fitness",
      slug: "gym-fitness",
      description: "Equipment, Shoes & Training Gear",
      products: 84,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
      featured: false,
    },
  ];

  const featuredCategories = categories.filter((cat) => cat.featured);
  const regularCategories = categories.filter((cat) => !cat.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Shop by Category
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our wide range of sports equipment and apparel
          </p>
        </div>

        {/* Featured Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.slug}`}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full">
                  <div className="relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-64 object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-primary">
                      Featured
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm opacity-90 mb-2">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{category.products} products</span>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* All Categories */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">All Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {regularCategories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.slug}`}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full">
                  <div className="relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                      <p className="text-xs opacity-90 mb-2">{category.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span>{category.products} products</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Category Benefits */}
        <section className="mt-16 bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Why Shop by Category?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Find What You Need</h3>
              <p className="text-sm text-muted-foreground">
                Quickly navigate to your sport and discover all related products
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Expert Curation</h3>
              <p className="text-sm text-muted-foreground">
                Handpicked products selected by sports enthusiasts
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Best Deals</h3>
              <p className="text-sm text-muted-foreground">
                Category-specific offers and bundle discounts
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Categories;
