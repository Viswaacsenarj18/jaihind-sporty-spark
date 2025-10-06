import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Products Grid */}
      <div className="flex-1">
        <ProductGrid />
      </div>

      {/* Footer removed from here because it is rendered globally in App.tsx */}
    </div>
  );
};

export default Index;
