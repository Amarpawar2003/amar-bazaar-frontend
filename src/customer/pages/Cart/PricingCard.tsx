import React, { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import { api } from "../../../config/api";

interface CartData {
  totalMrpPrice: number;
  totalSellingPrice: number;
  discount: number;
  totalItem: number;
}

const PricingCard = () => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          return;
        }

        const response = await api.get<CartData>("/api/cart", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        console.log("PRICING CART:", response.data);

        setCart(response.data);
      } catch (error: any) {
        console.error("PRICING CARD ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="p-5">
        <p>Loading price...</p>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="p-5">
        <p>Unable to load price.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-5">

      {/* Subtotal / MRP */}
      <div className="flex justify-between items-center">
        <span>Subtotal</span>
        <span>₹{cart.totalMrpPrice}</span>
      </div>

      {/* Discount */}
      <div className="flex justify-between items-center">
        <span>Discount</span>
        <span>₹{cart.discount}</span>
      </div>

      {/* Shipping */}
      <div className="flex justify-between items-center">
        <span>Shipping</span>
        <span>₹Free</span>
      </div>

      {/* Platform */}
      <div className="flex justify-between items-center">
        <span>Platform</span>
        <span>₹Free</span>
      </div>

      <Divider />

      {/* Final Selling Price */}
      <div className="flex justify-between items-center p-5 text-primary-color">
        <span>Total</span>
        <span>₹{cart.totalSellingPrice}</span>
      </div>

    </div>
  );
};

export default PricingCard;