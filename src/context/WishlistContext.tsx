import { createContext, useContext, useEffect, useState } from "react";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (item: WishlistItem) => {
    if (!wishlist.some((p) => p.id === item.id)) {
      setWishlist([...wishlist, item]);
    }
  };

  const removeFromWishlist = (id: string) =>
    setWishlist(wishlist.filter((p) => p.id !== id));

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext)!;
