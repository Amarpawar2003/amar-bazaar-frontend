import React, {
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

interface SimilarProductData {
  id: number;
  title: string;
  description?: string;
  mrPrice: number;
  sellingPrice: number;
  discountPercent: number;
  quantity: number;
  images?: string[];
  color?: string;
  numRatings?: number;
}

interface SimilarProductCardProps {
  product: SimilarProductData;
}

const SimilarProductCard: React.FC<
  SimilarProductCardProps
> = ({ product }) => {
  const navigate = useNavigate();

  const [imageError, setImageError] =
    useState(false);

  const [wishlist, setWishlist] =
    useState(false);

  /*
   * =========================================================
   * IMAGE
   * =========================================================
   */

  const productImage = useMemo(() => {
    if (
      !imageError &&
      product.images &&
      product.images.length > 0 &&
      product.images[0]
    ) {
      return product.images[0];
    }

    return "/images/img0.jpg";
  }, [product.images, imageError]);

  /*
   * =========================================================
   * PRICE
   * =========================================================
   */

  const sellingPrice =
    Number(product.sellingPrice) || 0;

  const mrPrice =
    Number(product.mrPrice) || 0;

  const discount =
    Number(product.discountPercent) || 0;

  /*
   * =========================================================
   * STOCK
   * =========================================================
   */

  const outOfStock =
    !product.quantity ||
    product.quantity <= 0;

  /*
   * =========================================================
   * OPEN PRODUCT
   * =========================================================
   */

  const openProduct = () => {
    navigate(
      `/product-details/${product.id}`
    );
  };

  /*
   * =========================================================
   * WISHLIST
   * =========================================================
   */

  const handleWishlist = (
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    const jwt =
      localStorage.getItem("jwt");

    if (!jwt) {
      navigate("/login");
      return;
    }

    /*
     * Actual wishlist API can be connected
     * here if needed. For now this only
     * changes the visual state.
     */
    setWishlist(
      (previous) => !previous
    );
  };

  /*
   * =========================================================
   * CARD
   * =========================================================
   */

  return (
    <article
      className="
        group
        relative
        cursor-pointer
        overflow-hidden
        rounded-2xl
        border
        border-slate-100
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-slate-200
        hover:shadow-lg
      "
      onClick={openProduct}
    >

      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div
        className="
          relative
          aspect-square
          overflow-hidden
          bg-slate-50
        "
      >

        <img
          src={productImage}
          alt={product.title}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
          onError={() =>
            setImageError(true)
          }
        />

        {/* DISCOUNT */}

        {discount > 0 && (
          <div
            className="
              absolute
              left-2
              top-2
              rounded-lg
              bg-green-600
              px-2
              py-1
              text-[10px]
              font-bold
              text-white
              sm:text-xs
            "
          >
            {discount}% OFF
          </div>
        )}

        {/* OUT OF STOCK */}

        {outOfStock && (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-black/35
            "
          >
            <span
              className="
                rounded-full
                bg-red-600
                px-3
                py-1.5
                text-[10px]
                font-bold
                uppercase
                text-white
                sm:text-xs
              "
            >
              Out of Stock
            </span>
          </div>
        )}

        {/* WISHLIST */}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label="Wishlist"
          className="
            absolute
            right-2
            top-2
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-slate-600
            shadow-sm
            backdrop-blur
            transition
            hover:scale-105
            hover:text-[#d81b8c]
          "
        >
          {wishlist ? (
            <FavoriteIcon
              sx={{
                fontSize: 20,
                color: "#d81b8c",
              }}
            />
          ) : (
            <FavoriteBorderIcon
              sx={{
                fontSize: 20,
              }}
            />
          )}
        </button>

        {/* QUICK ACTION */}

        <div
          className="
            absolute
            bottom-3
            left-1/2
            hidden
            -translate-x-1/2
            opacity-0
            transition
            duration-300
            group-hover:block
            group-hover:opacity-100
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-white
              px-3
              py-2
              text-xs
              font-semibold
              text-slate-700
              shadow-lg
            "
          >
            <ShoppingBagOutlinedIcon
              sx={{ fontSize: 16 }}
            />

            View Product
          </div>
        </div>

      </div>

      {/* =====================================================
          DETAILS
      ===================================================== */}

      <div className="p-3 sm:p-4">

        {/* TITLE */}

        <h3
          className="
            line-clamp-1
            text-sm
            font-bold
            text-slate-800
            sm:text-[15px]
          "
          title={product.title}
        >
          {product.title}
        </h3>

        {/* DESCRIPTION */}

        <p
          className="
            mt-1
            line-clamp-1
            text-xs
            text-slate-500
          "
        >
          {product.description ||
            product.color ||
            "Quality product"}
        </p>

        {/* RATING */}

        <div className="mt-2 flex items-center gap-1">

          <div
            className="
              flex
              items-center
              rounded
              bg-green-600
              px-1.5
              py-0.5
              text-[10px]
              font-bold
              text-white
            "
          >
            <span>
              {product.numRatings || 0}
            </span>

            <StarIcon
              sx={{
                fontSize: 11,
                marginLeft: "2px",
              }}
            />
          </div>

          <span
            className="
              text-[10px]
              text-slate-400
            "
          >
            {product.numRatings || 0} ratings
          </span>

        </div>

        {/* PRICE */}

        <div
          className="
            mt-3
            flex
            flex-wrap
            items-center
            gap-x-2
            gap-y-1
          "
        >

          <span
            className="
              text-base
              font-extrabold
              text-slate-900
              sm:text-lg
            "
          >
            ₹
            {sellingPrice.toLocaleString(
              "en-IN"
            )}
          </span>

          {mrPrice > sellingPrice && (
            <span
              className="
                text-xs
                text-slate-400
                line-through
                sm:text-sm
              "
            >
              ₹
              {mrPrice.toLocaleString(
                "en-IN"
              )}
            </span>
          )}

        </div>

        {/* STOCK / ACTION */}

        <div className="mt-3 flex items-center justify-between">

          <span
            className={`
              text-[10px]
              font-semibold
              sm:text-xs
              ${
                outOfStock
                  ? "text-red-500"
                  : "text-green-600"
              }
            `}
          >
            {outOfStock
              ? "Out of stock"
              : "In stock"}
          </span>

          <span
            className="
              text-[10px]
              font-semibold
              text-[#d81b8c]
              sm:text-xs
            "
          >
            View →
          </span>

        </div>

      </div>

    </article>
  );
};

export default SimilarProductCard;