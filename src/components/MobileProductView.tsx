import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ShoppingCart, Star, Minus, Plus, Check, X } from "lucide-react";

interface MobileProductViewProps {
  initialCartCount?: number;
  onAddToCart?: (payload: {
    productId: string;
    size: string;
    color: string;
    qty: number;
    price: number;
  }) => void;
}

// Mock product data
const product = {
  id: "prod-001",
  name: "Premium Running Shoes",
  brand: "SportPro",
  rating: 4.5,
  reviewCount: 328,
  price: 2999,
  originalPrice: 4999,
  discount: 40,
  images: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600",
  ],
  sizes: ["7", "8", "9", "10", "11"],
  colors: [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Blue", hex: "#2563EB" },
    { name: "Red", hex: "#DC2626" },
  ],
  features: [
    "Breathable mesh upper",
    "Cushioned sole for comfort",
    "Non-slip rubber outsole",
    "Lightweight design",
  ],
  description:
    "Experience superior comfort and performance with our Premium Running Shoes. Engineered with advanced cushioning technology and breathable materials, these shoes are perfect for runners of all levels. The ergonomic design ensures optimal support during intense workouts while maintaining style for everyday wear.",
};

const MobileProductView: React.FC<MobileProductViewProps> = ({
  initialCartCount = 0,
  onAddToCart,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(initialCartCount);
  const [showDescription, setShowDescription] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Handle touch swipe for carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next image
      nextImage();
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right - previous image
      prevImage();
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.min(99, Math.max(1, prev + delta)));
  };

  const handleAddToCart = () => {
    setValidationError("");

    // Validate selections
    if (!selectedSize) {
      setValidationError("Please select a size");
      return;
    }
    if (!selectedColor) {
      setValidationError("Please select a color");
      return;
    }

    // Add to cart
    const payload = {
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      qty: quantity,
      price: product.price * quantity,
    };

    if (onAddToCart) {
      onAddToCart(payload);
    }

    setCartCount((prev) => prev + quantity);
    setToastMessage(`Added ${quantity} item(s) to cart`);
    setShowToast(true);
  };

  const savedAmount = product.originalPrice - product.price;
  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-accent rounded-full transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-semibold flex-1 text-center truncate px-2">
          {product.brand}
        </h1>
        <button
          className="p-2 hover:bg-accent rounded-full transition-colors relative"
          aria-label={`Cart with ${cartCount} items`}
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24">
        {/* Image Carousel */}
        <section className="relative bg-muted" aria-label="Product images">
          <div
            ref={imageContainerRef}
            className="relative aspect-square overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={product.images[currentImageIndex]}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg transition-all"
              aria-label="Next image"
            >
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-primary w-6"
                      : "bg-background/60"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                  aria-pressed={index === currentImageIndex}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? "border-primary scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </section>

        {/* Product Info */}
        <section className="px-4 py-4 space-y-4">
          {/* Title & Rating */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              {product.name}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-lg text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-green-600 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded">
                {product.discount}% OFF
              </span>
            </div>
            <p className="text-sm text-green-600">
              You saved ₹{savedAmount.toLocaleString()}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Key Features</h3>
            <ul className="space-y-1.5">
              {product.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div className="border-t border-border pt-4">
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="flex items-center justify-between w-full text-left"
              aria-expanded={showDescription}
            >
              <h3 className="font-semibold text-foreground">Description</h3>
              <ChevronLeft
                className={`w-5 h-5 transition-transform ${
                  showDescription ? "-rotate-90" : "rotate-180"
                }`}
              />
            </button>
            {showDescription && (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                    selectedSize === size
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Select Color</h3>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color.name
                      ? "border-primary scale-110"
                      : "border-border hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Select ${color.name} color`}
                  aria-pressed={selectedColor === color.name}
                >
                  {selectedColor === color.name && (
                    <Check
                      className={`absolute inset-0 m-auto w-5 h-5 ${
                        color.hex === "#FFFFFF" ? "text-black" : "text-white"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              <X className="w-4 h-4" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(99, Math.max(1, val)));
                }}
                className="w-16 text-center border border-border rounded-lg py-2 bg-background text-foreground font-semibold"
                min="1"
                max="99"
                aria-label="Quantity"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 99}
                className="p-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3 shadow-lg z-40">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Total Price</p>
            <p className="text-lg font-bold text-foreground">
              ₹{totalPrice.toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 active:scale-95 transition-all shadow-md"
          >
            Add to Cart
          </button>
        </div>
      </footer>

      {/* Toast Notification */}
      {showToast && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-3 rounded-lg shadow-xl z-50 animate-fade-in flex items-center gap-2 max-w-sm"
          role="alert"
        >
          <Check className="w-5 h-5 text-green-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default MobileProductView;
