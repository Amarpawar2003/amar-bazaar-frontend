import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../../../config/api";

interface Product {
  id: number;
  title: string;
  description?: string;
  mrPrice: number;
  sellingPrice: number;
  discountPercent: number;
  images?: string[];
  quantity?: number;
  color?: string;
}

const Watchlist: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // ================= GET WATCHLIST =================

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      setError("");

      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        setProducts([]);
        setError("Please login to view your watchlist.");
        setLoading(false);
        return;
      }

      const response = await api.get("/users/watchlist", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("WATCHLIST API RESPONSE:", response.data);

      // Backend directly returns Product[]
      if (Array.isArray(response.data)) {
        const watchlistProducts: Product[] = response.data;

        console.log(
          "WATCHLIST PRODUCTS:",
          watchlistProducts
        );

        console.log(
          "WATCHLIST PRODUCTS LENGTH:",
          watchlistProducts.length
        );

        setProducts(watchlistProducts);
      } else {
        console.error(
          "WATCHLIST RESPONSE IS NOT ARRAY:",
          response.data
        );

        setProducts([]);
        setError("Invalid watchlist response.");
      }

    } catch (error: any) {
      console.error("WATCHLIST ERROR:", error);

      console.error(
        "WATCHLIST ERROR RESPONSE:",
        error?.response?.data
      );

      setProducts([]);

      const backendMessage =
        error?.response?.data?.message;

      setError(
        backendMessage ||
        "Unable to load watchlist."
      );

    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD WATCHLIST =================

  useEffect(() => {
    fetchWatchlist();
  }, []);

  // ================= REMOVE WATCHLIST =================

  const handleRemove = async (productId: number) => {
    try {
      setError("");

      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        setError("Please login first.");
        return;
      }

      await api.delete(
        `/users/watchlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log(
        "PRODUCT REMOVED FROM WATCHLIST:",
        productId
      );

      // Immediately remove from UI
      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product.id !== productId
        )
      );

    } catch (error: any) {
      console.error(
        "REMOVE WATCHLIST ERROR:",
        error
      );

      console.error(
        "REMOVE WATCHLIST RESPONSE:",
        error?.response?.data
      );

      setError(
        error?.response?.data?.message ||
        "Unable to remove product from watchlist."
      );
    }
  };

  // ================= PRODUCT DETAILS =================

  const handleProductClick = (product: Product) => {
    navigate(
      `/product-details/${product.id}/${encodeURIComponent(
        product.title
      )}/${product.id}`
    );
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center py-20">
        <h2 className="text-xl font-semibold">
          Loading watchlist...
        </h2>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">

        <div className="bg-white rounded-lg p-8 text-center">

          <p className="text-red-500 mb-5">
            {error}
          </p>

          <Button
            variant="contained"
            onClick={fetchWatchlist}
            sx={{
              backgroundColor: "#d81b8c",
              "&:hover": {
                backgroundColor: "#b81775",
              },
            }}
          >
            Try Again
          </Button>

        </div>

      </div>
    );
  }

  // ================= EMPTY =================

  if (
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">

        <div className="bg-white rounded-lg p-10 text-center">

          <h2 className="text-2xl font-semibold mb-3">
            Your Watchlist is Empty
          </h2>

          <p className="text-gray-500 mb-6">
            Products you add to your wishlist
            will appear here.
          </p>

          <Button
            variant="contained"
            onClick={() => navigate("/products")}
            sx={{
              backgroundColor: "#d81b8c",
              "&:hover": {
                backgroundColor: "#b81775",
              },
            }}
          >
            Continue Shopping
          </Button>

        </div>

      </div>
    );
  }

  // ================= WATCHLIST =================

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}

      <div className="pb-6">

        <h1 className="text-2xl font-bold">
          My Watchlist
        </h1>

        <p className="text-gray-500 mt-1">
          Products you saved for later
        </p>

      </div>

      {/* PRODUCTS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {products.map((product) => (

          <div
            key={product.id}
            className="bg-white border rounded-lg overflow-hidden shadow-sm"
          >

            {/* ================= IMAGE ================= */}

            <div
              className="h-64 bg-gray-100 cursor-pointer"
              onClick={() =>
                handleProductClick(product)
              }
            >

              <img
                src={
                  Array.isArray(product.images) &&
                  product.images.length > 0
                    ? product.images[0]
                    : "/images/img0.jpg"
                }
                alt={product.title}
                className="w-full h-full object-contain"
                onError={(event) => {
                  event.currentTarget.src =
                    "/images/img0.jpg";
                }}
              />

            </div>

            {/* ================= DETAILS ================= */}

            <div className="p-4">

              <h2 className="font-semibold text-lg">
                {product.title}
              </h2>

              {product.color && (
                <p className="text-gray-500 text-sm mt-1">
                  Color: {product.color}
                </p>
              )}

              <div className="flex items-center gap-3 mt-3 flex-wrap">

                <span className="text-xl font-bold">
                  ₹{product.sellingPrice}
                </span>

                <span className="text-gray-400 line-through">
                  ₹{product.mrPrice}
                </span>

                <span className="text-green-600 font-semibold">
                  {product.discountPercent}% OFF
                </span>

              </div>

              {/* ================= BUTTONS ================= */}

              <div className="flex gap-3 mt-5">

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    handleProductClick(product)
                  }
                  sx={{
                    backgroundColor: "#d81b8c",
                    "&:hover": {
                      backgroundColor: "#b81775",
                    },
                  }}
                >
                  View Product
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    handleRemove(product.id)
                  }
                >
                  Remove
                </Button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Watchlist;