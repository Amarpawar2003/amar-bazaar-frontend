import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import StarIcon from "@mui/icons-material/Star";
import {
  Add,
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalShipping,
  Remove,
  Wallet,
  WorkspacePremium,
} from "@mui/icons-material";

import {
  Alert,
  Button,
  Divider,
  Snackbar,
} from "@mui/material";

import { api } from "../../../config/api";

import SimilarProduct from "./SimilarProduct";
import Review from "../Review/Review";

interface Category {
  id?: number;
  name?: string;
  categoryId?: string;
}

interface Seller {
  id?: number;
  sellerName?: string;
  businessName?: string;
}

interface ProductData {
  id: number;
  title: string;
  description: string;
  mrPrice: number;
  sellingPrice: number;
  discountPercent: number;
  quantity: number;
  color: string;
  images: string[];
  numRatings: number;
  category?: Category;
  seller?: Seller;
  createdAt?: string;
  Sizes?: string;
  reviews?: any[];
}

type SnackbarSeverity = "success" | "error" | "info" | "warning";

const ProductDetails = () => {
  const { productId } = useParams<{
    categoryId?: string;
    name?: string;
    productId?: string;
  }>();

  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductData | null>(null);

  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  const [selectedSize, setSelectedSize] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);

  const [addingToCart, setAddingToCart] = useState(false);

  const [addingToWishlist, setAddingToWishlist] =
    useState(false);

  const [wishlistAdded, setWishlistAdded] =
    useState(false);

  /*
   * Always start at the top when opening a different product.
   * This prevents the browser from keeping the previous page's scroll position and jumping directly to Reviews.
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [productId]);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  const showMessage = (
    message: string,
    severity: SnackbarSeverity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  /*
   * =========================================================
   * GET PRODUCT
   * =========================================================
   */

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response =
          await api.get<ProductData>(
            `/products/${productId}`
          );

        const productData = response.data;

        setProduct(productData);

        setQuantity(1);
        setSelectedImage(0);

        /*
         * Select first available size automatically.
         */
        const availableSizes =
          productData.Sizes
            ?.split(",")
            .map((size) => size.trim())
            .filter(Boolean) || [];

        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0]);
        } else {
          setSelectedSize("");
        }
      } catch (error: any) {
        console.error(
          "PRODUCT FETCH ERROR:",
          error
        );

        showMessage(
          error?.response?.data?.message ||
            "Unable to load product.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  /*
   * =========================================================
   * PRODUCT IMAGES
   * =========================================================
   */

  const images = useMemo(() => {
    if (
      product?.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images.filter(Boolean);
    }

    return ["/images/img0.jpg"];
  }, [product]);

  /*
   * =========================================================
   * PRODUCT SIZES
   * =========================================================
   */

  const sizes = useMemo(() => {
    return (
      product?.Sizes
        ?.split(",")
        .map((size) => size.trim())
        .filter(Boolean) || []
    );
  }, [product]);

  /*
   * =========================================================
   * PRICE
   * =========================================================
   */

  const formattedSellingPrice =
    product?.sellingPrice != null
      ? product.sellingPrice.toLocaleString("en-IN")
      : "0";

  const formattedMrPrice =
    product?.mrPrice != null
      ? product.mrPrice.toLocaleString("en-IN")
      : "0";

  /*
   * =========================================================
   * QUANTITY
   * =========================================================
   */

  const increaseQuantity = () => {
    if (!product) {
      return;
    }

    const stock = Math.max(
      product.quantity || 0,
      0
    );

    setQuantity((previous) =>
      Math.min(previous + 1, stock || 1)
    );
  };

  const decreaseQuantity = () => {
    setQuantity((previous) =>
      Math.max(previous - 1, 1)
    );
  };

  /*
   * =========================================================
   * ADD TO CART
   * =========================================================
   */

  const handleAddToCart = async (): Promise<boolean> => {
    if (!product) {
      return false;
    }

    const jwt =
      localStorage.getItem("jwt");

    /*
     * LOGIN CHECK
     */
    if (!jwt) {
      showMessage(
        "Please login before adding product to cart.",
        "error"
      );

      navigate("/login");

      return false;
    }

    /*
     * STOCK CHECK
     */
    if (!product.quantity || product.quantity <= 0) {
      showMessage(
        "This product is currently out of stock.",
        "error"
      );

      return false;
    }

    /*
     * SIZE CHECK ONLY WHEN PRODUCT HAS SIZES
     */
    if (
      sizes.length > 0 &&
      !selectedSize
    ) {
      showMessage(
        "Please select a size.",
        "error"
      );

      return false;
    }

    try {
      setAddingToCart(true);

      const request = {
        productId: product.id,

        /*
         * Products without sizes receive empty string.
         */
        size: selectedSize || "",

        quantity,
      };

      console.log(
        "ADD TO CART REQUEST:",
        request
      );

      const response = await api.put(
        "/api/cart/add",
        request,
        {
          headers: {
            Authorization:
              `Bearer ${jwt}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      console.log(
        "ADD TO CART RESPONSE:",
        response.data
      );

      /*
       * Notify other components if they listen
       * for cart updates.
       */
      window.dispatchEvent(
        new Event("cart-updated")
      );

      showMessage(
        "Product added to cart successfully!",
        "success"
      );

      return true;
    } catch (error: any) {
      console.error(
        "ADD TO CART ERROR:",
        error
      );

      console.error(
        "ADD TO CART RESPONSE:",
        error?.response?.data
      );

      showMessage(
        error?.response?.data?.message ||
          "Unable to add product to cart.",
        "error"
      );

      return false;
    } finally {
      setAddingToCart(false);
    }
  };

  /*
   * =========================================================
   * WISHLIST
   * =========================================================
   */

  const handleAddToWishlist = async () => {
    if (!product) {
      return;
    }

    const jwt =
      localStorage.getItem("jwt");

    /*
     * LOGIN CHECK
     */
    if (!jwt) {
      showMessage(
        "Please login before adding to wishlist.",
        "error"
      );

      navigate("/login");

      return;
    }

    /*
     * Already added in this page session.
     */
    if (wishlistAdded) {
      showMessage(
        "Product is already in your wishlist.",
        "info"
      );

      return;
    }

    try {
      setAddingToWishlist(true);

      await api.post(
        `/users/watchlist/${product.id}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${jwt}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      setWishlistAdded(true);

      /*
       * Notify wishlist components.
       */
      window.dispatchEvent(
        new Event("wishlist-updated")
      );

      showMessage(
        "Product added to wishlist!",
        "success"
      );
    } catch (error: any) {
      console.error(
        "WISHLIST ERROR:",
        error
      );

      console.error(
        "WISHLIST RESPONSE:",
        error?.response?.data
      );

      showMessage(
        error?.response?.data?.message ||
          "Unable to add product to wishlist.",
        "error"
      );
    } finally {
      setAddingToWishlist(false);
    }
  };

  /*
   * =========================================================
   * BUY NOW
   * =========================================================
   */

  const handleBuyNow = async () => {
    if (!product) {
      return;
    }

    const jwt =
      localStorage.getItem("jwt");

    /*
     * LOGIN CHECK
     */
    if (!jwt) {
      showMessage(
        "Please login before buying this product.",
        "error"
      );

      navigate("/login");

      return;
    }

    /*
     * STOCK CHECK
     */
    if (!product.quantity || product.quantity <= 0) {
      showMessage(
        "This product is currently out of stock.",
        "error"
      );

      return;
    }

    /*
     * SIZE CHECK
     */
    if (
      sizes.length > 0 &&
      !selectedSize
    ) {
      showMessage(
        "Please select a size.",
        "error"
      );

      return;
    }

    /*
     * Add to cart first.
     */
    const added =
      await handleAddToCart();

    /*
     * Only navigate when cart operation succeeds.
     */
    if (added) {
      navigate("/checkout");
    }
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <main className="ab-page py-8">
        <div className="ab-section">
          <div className="ab-card p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

              <div className="animate-pulse">
                <div className="h-[450px] rounded-2xl bg-slate-200" />
              </div>

              <div className="animate-pulse space-y-5">

                <div className="h-5 w-40 rounded bg-slate-200" />

                <div className="h-10 w-3/4 rounded bg-slate-200" />

                <div className="h-5 w-full rounded bg-slate-200" />

                <div className="h-5 w-5/6 rounded bg-slate-200" />

                <div className="h-px w-full bg-slate-200" />

                <div className="h-10 w-1/2 rounded bg-slate-200" />

                <div className="h-12 w-full rounded bg-slate-200" />

                <div className="h-12 w-full rounded bg-slate-200" />

              </div>

            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * PRODUCT NOT FOUND
   * =========================================================
   */

  if (!product) {
    return (
      <main className="ab-page py-16">
        <div className="ab-section">

          <div className="ab-card flex flex-col items-center justify-center p-10 text-center">

            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <AddShoppingCart
                sx={{
                  fontSize: 38,
                  color: "#94a3b8",
                }}
              />
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              Product not found
            </h2>

            <p className="mt-2 text-slate-500">
              The product you are looking for
              is not available.
            </p>

            <Button
              variant="contained"
              onClick={() =>
                navigate("/products")
              }
              sx={{
                marginTop: 3,
                textTransform: "none",
                borderRadius: "10px",
              }}
            >
              Back to Products
            </Button>

          </div>

        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * OUT OF STOCK
   * =========================================================
   */

  const isOutOfStock =
    !product.quantity ||
    product.quantity <= 0;

  /*
   * =========================================================
   * MAIN UI
   * =========================================================
   */

  return (
    <main className="ab-page py-5 sm:py-8">

      <div className="ab-section">

        {/* =================================================
            PRODUCT MAIN CARD
        ================================================= */}

        <div className="ab-card overflow-hidden p-4 sm:p-6 lg:p-8">

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

            {/* =================================================
                IMAGE GALLERY
            ================================================= */}

            <div className="min-w-0">

              <div className="flex flex-col gap-4 sm:flex-row">

                {/* THUMBNAILS */}

                <div
                  className="
                    order-2
                    flex
                    max-w-full
                    gap-3
                    overflow-x-auto
                    pb-1
                    sm:order-1
                    sm:w-[84px]
                    sm:flex-col
                    sm:overflow-x-visible
                  "
                >

                  {images.map(
                    (image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setSelectedImage(index)
                        }
                        className={`
                          h-20
                          w-20
                          flex-shrink-0
                          overflow-hidden
                          rounded-xl
                          border-2
                          bg-white
                          transition-all
                          ${
                            selectedImage ===
                            index
                              ? "border-blue-600 ring-2 ring-blue-100"
                              : "border-slate-200 hover:border-slate-400"
                          }
                        `}
                      >

                        <img
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="h-full w-full object-cover"
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              "/images/img0.jpg";
                          }}
                        />

                      </button>
                    )
                  )}

                </div>

                {/* MAIN IMAGE */}

                <div
                  className="
                    order-1
                    relative
                    flex
                    min-h-[360px]
                    flex-1
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-100
                    bg-[#f8fafc]
                    p-5
                    sm:order-2
                    sm:min-h-[500px]
                  "
                >

                  <img
                    src={
                      images[selectedImage] ||
                      images[0] ||
                      "/images/img0.jpg"
                    }
                    alt={product.title}
                    className="
                      max-h-[520px]
                      w-full
                      object-contain
                      transition-transform
                      duration-300
                      hover:scale-105
                    "
                    onError={(
                      event
                    ) => {
                      event.currentTarget.src =
                        "/images/img0.jpg";
                    }}
                  />

                  {/* IMAGE COUNTER */}

                  {images.length > 1 && (
                    <div
                      className="
                        absolute
                        bottom-4
                        right-4
                        rounded-full
                        bg-black/70
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-white
                      "
                    >
                      {selectedImage + 1}
                      /
                      {images.length}
                    </div>
                  )}

                  {/* OUT OF STOCK */}

                  {isOutOfStock && (
                    <div
                      className="
                        absolute
                        left-4
                        top-4
                        rounded-full
                        bg-red-600
                        px-4
                        py-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        text-white
                      "
                    >
                      Out of Stock
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <div className="min-w-0">

              {/* BRAND LABEL */}

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1769ff]">
                Amar Bazaar Product
              </p>

              {/* TITLE */}

              <h1
                className="
                  text-2xl
                  font-extrabold
                  leading-tight
                  text-slate-800
                  sm:text-3xl
                "
              >
                {product.title}
              </h1>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-3
                  line-clamp-3
                  leading-6
                  text-slate-500
                "
              >
                {product.description}
              </p>

              {/* =================================================
                  RATING / RATINGS COUNT
              ================================================= */}

              <div className="mt-5 flex flex-wrap items-center gap-3">

                <div
                  className="
                    flex
                    items-center
                    rounded-lg
                    bg-green-600
                    px-2.5
                    py-1.5
                    text-sm
                    font-bold
                    text-white
                  "
                >

                  <span>
                    {product.numRatings || 0}
                  </span>

                  <StarIcon
                    sx={{
                      fontSize: 17,
                      marginLeft: "3px",
                    }}
                  />

                </div>

                <span className="text-sm text-slate-500">
                  {product.numRatings || 0}
                  {" "}
                  Ratings
                </span>

                {product.color && (
                  <>
                    <span className="text-slate-300">
                      |
                    </span>

                    <span className="text-sm text-slate-600">
                      Color:
                      {" "}
                      <strong>
                        {product.color}
                      </strong>
                    </span>
                  </>
                )}

              </div>

              <Divider className="my-6" />

              {/* =================================================
                  PRICE
              ================================================= */}

              <div className="flex flex-wrap items-center gap-3">

                <span
                  className="
                    text-3xl
                    font-extrabold
                    text-slate-900
                    sm:text-4xl
                  "
                >
                  ₹{formattedSellingPrice}
                </span>

                {product.mrPrice >
                  product.sellingPrice && (
                  <span
                    className="
                      text-lg
                      text-slate-400
                      line-through
                    "
                  >
                    ₹{formattedMrPrice}
                  </span>
                )}

                {product.discountPercent > 0 && (
                  <span
                    className="
                      rounded-lg
                      bg-green-50
                      px-2.5
                      py-1
                      text-sm
                      font-bold
                      text-green-600
                    "
                  >
                    {product.discountPercent}% OFF
                  </span>
                )}

              </div>

              <p className="mt-2 text-sm text-slate-500">
                Inclusive of applicable taxes
              </p>

              {/* =================================================
                  DELIVERY / BENEFITS
              ================================================= */}

              <div className="mt-7 space-y-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                    <LocalShipping
                      sx={{
                        color: "#00897b",
                      }}
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      Free delivery
                    </p>

                    <p className="text-sm text-slate-500">
                      Fast and reliable delivery
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                    <WorkspacePremium
                      sx={{
                        color: "#00897b",
                      }}
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      Quality assured
                    </p>

                    <p className="text-sm text-slate-500">
                      Product quality support
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                    <Wallet
                      sx={{
                        color: "#00897b",
                      }}
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      Secure payment
                    </p>

                    <p className="text-sm text-slate-500">
                      Safe and secure checkout
                    </p>
                  </div>

                </div>

              </div>

              {/* =================================================
                  SIZE
              ================================================= */}

              {sizes.length > 0 && (
                <div className="mt-8">

                  <div className="mb-3 flex items-center justify-between">

                    <h3 className="font-bold text-slate-800">
                      Select Size
                    </h3>

                    <span className="text-xs text-slate-500">
                      Required
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    {sizes.map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={
                          selectedSize === size
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() =>
                          setSelectedSize(size)
                        }
                        sx={{
                          minWidth: 58,
                          minHeight: 42,
                          borderRadius:
                            "10px",
                          textTransform:
                            "none",
                          fontWeight: 700,
                        }}
                      >
                        {size}
                      </Button>
                    ))}

                  </div>

                </div>
              )}

              {/* =================================================
                  QUANTITY
              ================================================= */}

              <div className="mt-8">

                <h3 className="mb-3 font-bold text-slate-800">
                  Quantity
                </h3>

                <div className="flex items-center gap-4">

                  <div
                    className="
                      inline-flex
                      items-center
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                    "
                  >

                    <Button
                      type="button"
                      variant="text"
                      disabled={
                        quantity <= 1
                      }
                      onClick={
                        decreaseQuantity
                      }
                      sx={{
                        minWidth: 48,
                        height: 46,
                        borderRadius: 0,
                      }}
                    >
                      <Remove />
                    </Button>

                    <span
                      className="
                        flex
                        h-[46px]
                        w-14
                        items-center
                        justify-center
                        border-x
                        border-slate-200
                        font-bold
                        text-slate-800
                      "
                    >
                      {quantity}
                    </span>

                    <Button
                      type="button"
                      variant="text"
                      disabled={
                        isOutOfStock ||
                        quantity >=
                          product.quantity
                      }
                      onClick={
                        increaseQuantity
                      }
                      sx={{
                        minWidth: 48,
                        height: 46,
                        borderRadius: 0,
                      }}
                    >
                      <Add />
                    </Button>

                  </div>

                  <span className="text-sm text-slate-500">
                    {isOutOfStock
                      ? "Currently unavailable"
                      : `${product.quantity} items available`}
                  </span>

                </div>

              </div>

              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">

                {/* ADD TO BAG */}

                <Button
                  fullWidth
                  type="button"
                  variant="contained"
                  startIcon={
                    <AddShoppingCart />
                  }
                  disabled={
                    addingToCart ||
                    isOutOfStock
                  }
                  onClick={
                    handleAddToCart
                  }
                  sx={{
                    minHeight: 52,
                    borderRadius:
                      "12px",
                    backgroundColor:
                      "#d81b8c",
                    fontWeight: 800,
                    textTransform:
                      "none",
                    "&:hover": {
                      backgroundColor:
                        "#b81775",
                    },
                  }}
                >
                  {addingToCart
                    ? "Adding..."
                    : isOutOfStock
                    ? "Out of Stock"
                    : "Add to Bag"}
                </Button>

                {/* WISHLIST */}

                <Button
                  fullWidth
                  type="button"
                  variant="outlined"
                  startIcon={
                    wishlistAdded ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorder />
                    )
                  }
                  disabled={
                    addingToWishlist
                  }
                  onClick={
                    handleAddToWishlist
                  }
                  sx={{
                    minHeight: 52,
                    borderRadius:
                      "12px",
                    borderColor:
                      wishlistAdded
                        ? "#d81b8c"
                        : "#cbd5e1",
                    color: wishlistAdded
                      ? "#d81b8c"
                      : "#334155",
                    fontWeight: 800,
                    textTransform:
                      "none",
                  }}
                >
                  {addingToWishlist
                    ? "Adding..."
                    : wishlistAdded
                    ? "Wishlisted"
                    : "Wishlist"}
                </Button>

              </div>

              {/* =================================================
                  BUY NOW
              ================================================= */}

              <Button
                fullWidth
                type="button"
                variant="contained"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                sx={{
                  minHeight: 54,
                  marginTop: "12px",
                  borderRadius: "12px",
                  backgroundColor:
                    "#d81b8c",
                  fontSize: "16px",
                  fontWeight: 800,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor:
                      "#b81775",
                  },
                }}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : "Buy Now"}
              </Button>

              {/* =================================================
                  SELLER
              ================================================= */}

              {product.seller && (
                <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Sold by
                  </p>

                  <p className="mt-1 font-bold text-slate-800">
                    {product.seller.businessName ||
                      product.seller.sellerName ||
                      "Amar Bazaar Seller"}
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* =================================================
            PRODUCT DESCRIPTION
        ================================================= */}

        <div className="ab-card mt-6 p-5 sm:p-7">

          <h2 className="text-xl font-extrabold text-slate-800">
            Product Description
          </h2>

          <Divider className="my-4" />

          <p className="whitespace-pre-line leading-7 text-slate-600">
            {product.description ||
              "No product description available."}
          </p>

        </div>

        {/* =================================================
            SIMILAR PRODUCTS
        ================================================= */}

        <div className="ab-card mt-6 overflow-hidden p-4 sm:p-6">

          <div className="mb-5">

            <h2 className="text-xl font-extrabold text-slate-800">
              Similar Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              You may also like these products
            </p>

          </div>

          <SimilarProduct />

        </div>

        {/* =================================================
            REVIEWS
        ================================================= */}

        <div className="ab-card mt-6 overflow-hidden p-4 sm:p-6">

          <div className="mb-5">

            <h2 className="text-xl font-extrabold text-slate-800">
              Customer Reviews
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              See what customers are saying
            </p>

          </div>

          <Review />

        </div>

        {/* =================================================
            SNACKBAR
        ================================================= */}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3500}
          onClose={closeSnackbar}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Alert
            severity={snackbar.severity}
            variant="filled"
            onClose={closeSnackbar}
            sx={{
              width: "100%",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

      </div>

    </main>
  );
};

export default ProductDetails;