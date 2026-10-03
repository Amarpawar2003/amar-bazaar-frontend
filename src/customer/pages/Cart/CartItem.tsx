import React, { useState } from "react";
import {
  Add,
  Delete,
  Remove,
} from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { api } from "../../../config/api";

interface CartItemProps {
  item: any;
  onCartUpdated: () => Promise<void>;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onCartUpdated,
}) => {
  const [loading, setLoading] = useState(false);

  const product = item?.product;

  // ================= PRODUCT IMAGE =================

  const productImage =
    product?.images?.length > 0
      ? product.images[0]
      : "/images/img0.jpg";

  // ================= QUANTITY =================

  const handleQuantityChange = async (
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setLoading(true);

      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        return;
      }

      await api.put(
        `/api/cart/item/${item.id}`,
        {
          quantity: newQuantity,
          size: item.size,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      await onCartUpdated();
    } catch (error: any) {
      console.error(
        "UPDATE CART ITEM ERROR:",
        error
      );

      console.error(
        "RESPONSE:",
        error?.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= REMOVE =================

  const handleRemove = async () => {
    try {
      setLoading(true);

      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        return;
      }

      await api.delete(
        `/api/cart/item/${item.id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      await onCartUpdated();
    } catch (error: any) {
      console.error(
        "REMOVE CART ITEM ERROR:",
        error
      );

      console.error(
        "RESPONSE:",
        error?.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <div className="border rounded-md p-4">

      <div className="flex gap-4">

        {/* ================= PRODUCT IMAGE ================= */}

        <div className="w-28 h-32 flex-shrink-0">

          <img
            src={productImage}
            alt={product?.title || "Product"}
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.src = "/images/img0.jpg";
            }}
          />

        </div>

        {/* ================= PRODUCT DETAILS ================= */}

        <div className="flex-1">

          <div className="flex justify-between gap-3">

            <div>

              <h2 className="font-semibold text-lg">
                {product?.title || "Product"}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Size: {item?.size || "N/A"}
              </p>

              <p className="text-gray-500 text-sm">
                Color: {product?.color || "N/A"}
              </p>

            </div>

            {/* REMOVE */}

            <IconButton
              onClick={handleRemove}
              disabled={loading}
              color="error"
              title="Remove"
            >
              <Delete />
            </IconButton>

          </div>

          {/* ================= PRICE ================= */}

          <div className="mt-3">

            <span className="text-lg font-semibold">
              ₹{item?.sellingPrice || 0}
            </span>

            {product?.mrPrice && (
              <span className="ml-2 text-gray-400 line-through">
                ₹{item?.mrpPrice || product.mrPrice}
              </span>
            )}

          </div>

          {/* ================= QUANTITY ================= */}

          <div className="flex items-center gap-2 mt-4">

            <Button
              variant="outlined"
              size="small"
              disabled={
                loading ||
                item?.quantity <= 1
              }
              onClick={() =>
                handleQuantityChange(
                  item.quantity - 1
                )
              }
              sx={{
                minWidth: "36px",
                width: "36px",
                height: "36px",
              }}
            >
              <Remove fontSize="small" />
            </Button>

            <span className="min-w-[35px] text-center font-semibold">
              {item?.quantity || 1}
            </span>

            <Button
              variant="outlined"
              size="small"
              disabled={loading}
              onClick={() =>
                handleQuantityChange(
                  item.quantity + 1
                )
              }
              sx={{
                minWidth: "36px",
                width: "36px",
                height: "36px",
              }}
            >
              <Add fontSize="small" />
            </Button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CartItem;