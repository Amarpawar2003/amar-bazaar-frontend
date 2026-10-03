import React, { useEffect, useState } from "react";
import { Alert, Button, CircularProgress } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import { api } from "../../../config/api";

interface WishlistProduct {
  id: number;
  title: string;
  sellingPrice: number;
  mrPrice: number;
  discountPercent: number;
  images?: string[];
}

const Wishlist = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/api/wishlist");
        setProducts(response.data?.products || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Unable to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><CircularProgress /></div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 md:px-8 lg:px-16 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900">My Wishlist</h1>
        <p className="text-slate-500 mt-1">Products you want to keep for later.</p>

        {error && <Alert className="mt-6" severity="error">{error}</Alert>}

        {!error && products.length === 0 && (
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <FavoriteBorderIcon sx={{ fontSize: 52, color: "#cbd5e1" }} />
            <h2 className="text-xl font-bold mt-4">Your wishlist is empty</h2>
            <p className="text-slate-500 mt-2">Save products you love and find them here later.</p>
            <Button variant="contained" sx={{ mt: 3, textTransform: "none" }} onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
          {products.map((product) => (
            <article
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/product-details/0/${encodeURIComponent(product.title)}/${product.id}`)}
            >
              <div className="aspect-[4/5] bg-slate-100">
                <img src={product.images?.[0] || "/images/img0.jpg"} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h2 className="font-semibold line-clamp-2">{product.title}</h2>
                <div className="flex gap-2 mt-3">
                  <span className="font-bold">₹{product.sellingPrice}</span>
                  <span className="text-sm text-slate-400 line-through">₹{product.mrPrice}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Wishlist;
