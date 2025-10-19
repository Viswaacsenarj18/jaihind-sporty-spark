import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingCart, Star, Plus, Minus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

// Mock product data
const mockProduct = {
  id: "1",
  name: "Professional Cricket Bat",
  category: "Cricket",
  price: 2499,
  originalPrice: 3499,
  rating: 4.5,
  reviews: 128,
  description:
    "Premium English Willow cricket bat with superior balance and power. Perfect for professional players and enthusiasts.",
  features: [
    "Grade A English Willow",
    "Weight: 1.2-1.3 kg",
    "Short Handle",
    "Professional Grade",
    "Hand Crafted",
  ],
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  inStock: true,
  stockCount: 15,
};

const mockReviews = [
  {
    id: 1,
    user: "Rohit S.",
    rating: 5,
    comment: "Excellent bat! Great balance and pickup. Highly recommended.",
    date: "2 days ago",
  },
  {
    id: 2,
    user: "Virat K.",
    rating: 4,
    comment: "Good quality bat, but delivery was a bit slow.",
    date: "1 week ago",
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, Math.min(mockProduct.stockCount, quantity + delta)));
  };

  const handleAddToCart = () => {
    // Add to cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: mockProduct.id,
        name: mockProduct.name,
        price: mockProduct.price,
        originalPrice: mockProduct.originalPrice,
        image: mockProduct.images[0],
        quantity: 1,
        category: mockProduct.category,
      });
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${mockProduct.name} added to your cart.`,
    });
    
    // Reset quantity after adding
    setQuantity(1);
  };

  const discount = Math.round(
    ((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 text-sm"
        >
          <Link to="/products" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Product Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="space-y-2">
              <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden">
                <img
                  src={mockProduct.images[selectedImage]}
                  alt={mockProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-1">
                {mockProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={image} alt={`${mockProduct.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Badge variant="secondary" className="mb-1 text-xs">
              {mockProduct.category}
            </Badge>
            <h1 className="text-2xl font-bold text-foreground mb-2">{mockProduct.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3 text-sm">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(mockProduct.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">({mockProduct.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3 text-lg">
              <span className="font-bold text-primary">₹{mockProduct.price}</span>
              <span className="text-muted-foreground line-through text-sm">₹{mockProduct.originalPrice}</span>
              <Badge variant="destructive" className="text-xs">
                {discount}% OFF
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{mockProduct.description}</p>

            {/* Key Features */}
            <ul className="space-y-1 mb-3 text-sm">
              {mockProduct.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" /> {feature}
                </li>
              ))}
            </ul>

            <Separator />

            {/* Quantity & Actions */}
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= mockProduct.stockCount}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-muted-foreground text-xs">({mockProduct.stockCount} in stock)</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 text-sm" 
                  size="sm"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={isWishlisted ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-3">Customer Reviews</h2>
          <div className="space-y-2">
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-muted-foreground text-xs">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
