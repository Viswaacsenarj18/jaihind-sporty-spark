import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { Trash2, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex gap-2 items-center">
          <Heart className="text-red-500" /> Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-4">No items in wishlist</p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wishlist.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg shadow-sm bg-card">
                <img src={item.image} className="w-full h-40 object-contain mb-2" />

                <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                <p className="text-primary font-bold text-sm mt-1">₹{item.price}</p>

                <div className="flex justify-between mt-2">
                  <Link to={`/product/${item.id}`}>
                    <Button size="sm">View</Button>
                  </Link>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
