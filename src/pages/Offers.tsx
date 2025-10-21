import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Tag, Clock, TrendingUp, Zap, Percent } from "lucide-react";

const Offers = () => {
  const specialOffers = [
    {
      id: 1,
      title: "Weekend Sale",
      description: "Flat 40% OFF on all sports shoes",
      code: "WEEKEND40",
      discount: "40% OFF",
      validUntil: "Jan 25, 2025",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      type: "hot",
    },
    {
      id: 2,
      title: "New User Offer",
      description: "Extra ₹500 OFF on first purchase above ₹2000",
      code: "FIRST500",
      discount: "₹500 OFF",
      validUntil: "Jan 31, 2025",
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600",
      type: "new",
    },
    {
      id: 3,
      title: "Flash Deal",
      description: "Limited time offer - Buy 2 Get 1 Free",
      code: "FLASH3",
      discount: "Buy 2 Get 1",
      validUntil: "Today Only",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600",
      type: "flash",
    },
  ];

  const categoryDeals = [
    {
      category: "T-Shirts & Apparel",
      slug: "apparel",
      discount: "Up to 30% OFF",
      products: 156,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    },
    {
      category: "Cricket",
      slug: "cricket",
      discount: "Up to 35% OFF",
      products: 128,
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400",
    },
    {
      category: "Badminton",
      slug: "badminton",
      discount: "Up to 25% OFF",
      products: 89,
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400",
    },
    {
      category: "Football",
      slug: "football",
      discount: "Up to 28% OFF",
      products: 95,
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400",
    },
    {
      category: "Kabaddi",
      slug: "kabaddi",
      discount: "Up to 20% OFF",
      products: 73,
      image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400",
    },
    {
      category: "Volleyball & Basketball",
      slug: "ball-sports",
      discount: "Up to 30% OFF",
      products: 142,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
    },
    {
      category: "Other Sports",
      slug: "other-sports",
      discount: "Up to 25% OFF",
      products: 198,
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
    },
    {
      category: "Indoor Games",
      slug: "indoor-games",
      discount: "Up to 35% OFF",
      products: 67,
      image: "https://images.unsplash.com/photo-1611891487183-17d959f29e4e?w=400",
    },
    {
      category: "Gym & Fitness",
      slug: "gym-fitness",
      discount: "Up to 40% OFF",
      products: 84,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    },
    {
      category: "Tennis",
      slug: "tennis",
      discount: "Up to 30% OFF",
      products: 78,
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400",
    },
  ];

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "hot": return "destructive";
      case "new": return "default";
      case "flash": return "secondary";
      default: return "outline";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "hot": return <TrendingUp className="w-4 h-4" />;
      case "new": return <Gift className="w-4 h-4" />;
      case "flash": return <Zap className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Special Offers & Deals
          </h1>
          <p className="text-lg text-muted-foreground">
            Don't miss out on our exclusive discounts and promotions
          </p>
        </div>

        {/* Featured Offers */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Gift className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Featured Offers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialOffers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    variant={getBadgeVariant(offer.type)}
                    className="absolute top-3 right-3 flex items-center gap-1"
                  >
                    {getIcon(offer.type)}
                    {offer.type.toUpperCase()}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {offer.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary">
                      {offer.discount}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {offer.validUntil}
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Use Code:</span>
                      <code className="font-mono font-bold text-foreground">
                        {offer.code}
                      </code>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link to="/products">Shop Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Category Deals */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Percent className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Category Deals</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categoryDeals.map((deal, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                <Link to={`/products?category=${deal.slug}`}>
                  <div className="relative">
                    <img
                      src={deal.image}
                      alt={deal.category}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{deal.category}</h3>
                      <p className="text-lg font-semibold text-yellow-400">
                        {deal.discount}
                      </p>
                      <p className="text-sm opacity-90">{deal.products} products</p>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* How to Redeem */}
        <section className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            How to Redeem Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Choose Products</h3>
              <p className="text-sm text-muted-foreground">
                Browse and add items to your cart
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Apply Code</h3>
              <p className="text-sm text-muted-foreground">
                Enter the coupon code at checkout
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Save Money</h3>
              <p className="text-sm text-muted-foreground">
                Enjoy instant discounts on your order
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Offers;
