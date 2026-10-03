import React, { useEffect, useState } from "react";
import "./ProductCard.css";

import {
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
  Tooltip,
} from "@mui/material";

import {
  Favorite,
  FavoriteBorder,
  Star,
  VisibilityOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { ProductData } from "./Product";
import { api } from "../../../config/api";

interface ProductCardProps {
  product: ProductData;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  /* =====================================================
     IMAGE
  ===================================================== */

  const [currentImage, setCurrentImage] = useState(0);

  const [isHovered, setIsHovered] = useState(false);

  /* =====================================================
     WISHLIST
  ===================================================== */

  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  /* =====================================================
     SNACKBAR
  ===================================================== */

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  /* =====================================================
     PRODUCT IMAGES
  ===================================================== */

  const images =
    product?.images &&
    Array.isArray(product.images) &&
    product.images.length > 0
      ? product.images
      : ["/images/img0.jpg"];

  /* =====================================================
     RESET WHEN PRODUCT CHANGES
  ===================================================== */

  useEffect(() => {
    setCurrentImage(0);
    setIsWishlisted(false);
  }, [product?.id]);

  /* =====================================================
     AUTO IMAGE SLIDER
  ===================================================== */

  useEffect(() => {
    if (!isHovered || images.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentImage(
        (previous) =>
          (previous + 1) % images.length
      );
    }, 1800);

    return () => {
      window.clearInterval(interval);
    };
  }, [isHovered, images.length]);

  /* =====================================================
     PRODUCT DETAILS
  ===================================================== */

  const handleProductClick = () => {
    const categoryId =
      product?.category?.id ?? 0;

    const productName = encodeURIComponent(
      product?.title || "product"
    );

    navigate(
      `/product-details/${categoryId}/${productName}/${product.id}`
    );
  };

  /* =====================================================
     KEYBOARD NAVIGATION
  ===================================================== */

  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLElement>
  ) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      handleProductClick();
    }
  };

  /* =====================================================
     QUICK VIEW
  ===================================================== */

  const handleQuickView = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    handleProductClick();
  };

  /* =====================================================
     WISHLIST
  ===================================================== */

  const handleWishlist = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      setSnackbar({
        open: true,
        message:
          "Please login to add products to wishlist.",
        severity: "error",
      });

      window.setTimeout(() => {
        navigate("/login");
      }, 900);

      return;
    }

    if (wishlistLoading) {
      return;
    }

    try {
      setWishlistLoading(true);

      await api.post(
        `/users/watchlist/${product.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsWishlisted(true);

      setSnackbar({
        open: true,
        message:
          "Product added to wishlist!",
        severity: "success",
      });

      window.dispatchEvent(
        new Event("wishlist-updated")
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

      if (
        error?.response?.status === 409
      ) {
        setIsWishlisted(true);

        setSnackbar({
          open: true,
          message:
            "Product is already in your wishlist.",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message:
            error?.response?.data?.message ||
            "Unable to add product to wishlist.",
          severity: "error",
        });
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  /* =====================================================
     IMAGE ERROR
  ===================================================== */

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const image = event.currentTarget;

    if (
      image.dataset.fallback === "true"
    ) {
      return;
    }

    image.dataset.fallback = "true";

    image.src = "/images/img0.jpg";
  };

  /* =====================================================
     PRICE FORMAT
  ===================================================== */

  const formatPrice = (
    price: number | undefined | null
  ) => {
    if (
      price === undefined ||
      price === null
    ) {
      return "0";
    }

    return Number(price).toLocaleString(
      "en-IN"
    );
  };

  /* =====================================================
     DISCOUNT
  ===================================================== */

  const discountPercent = Number(
    product?.discountPercent || 0
  );

  const sellingPrice = Number(
    product?.sellingPrice || 0
  );

  const mrPrice = Number(
    product?.mrPrice || 0
  );

  const hasDiscount =
    discountPercent > 0;

  const hasMrp =
    mrPrice > sellingPrice;

  /* =====================================================
     RATING
  ===================================================== */

  const rating = Number(
    product?.numRatings || 0
  );

  const hasRating = rating > 0;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <div className="product-card-shell">

        <article
          className="ab-product-card"
          onMouseEnter={() =>
            setIsHovered(true)
          }
          onMouseLeave={() =>
            setIsHovered(false)
          }
          onClick={handleProductClick}
          onKeyDown={handleCardKeyDown}
          role="button"
          tabIndex={0}
          aria-label={`View ${product?.title || "product"}`}
        >

          {/* ==================================================
              IMAGE
          ================================================== */}

          <div className="ab-product-image-wrap">

            <div className="ab-product-image-track">

              {images.map(
                (image, index) => (
                  <img
                    key={`${product.id}-${index}`}
                    src={image}
                    alt={
                      product?.title ||
                      "Product"
                    }
                    className="ab-product-image"
                    style={{
                      transform: `translateX(${
                        (index -
                          currentImage) *
                        100
                      }%)`,
                    }}
                    onError={
                      handleImageError
                    }
                    loading={
                      index === 0
                        ? "eager"
                        : "lazy"
                    }
                  />
                )
              )}

            </div>

            {/* ==================================================
                DISCOUNT
            ================================================== */}

            {hasDiscount && (
              <span className="ab-discount-badge">
                {discountPercent}% OFF
              </span>
            )}

            {/* ==================================================
                WISHLIST
            ================================================== */}

            <Tooltip
              title={
                isWishlisted
                  ? "Added to wishlist"
                  : "Add to wishlist"
              }
              arrow
            >
              <span className="ab-wishlist-position">

                <IconButton
                  className={`ab-wish-btn ${
                    isWishlisted
                      ? "ab-wish-active"
                      : ""
                  }`}
                  disabled={
                    wishlistLoading
                  }
                  onClick={
                    handleWishlist
                  }
                  aria-label={
                    isWishlisted
                      ? "Product added to wishlist"
                      : "Add product to wishlist"
                  }
                >

                  {wishlistLoading ? (
                    <CircularProgress
                      size={19}
                    />
                  ) : isWishlisted ? (
                    <Favorite />
                  ) : (
                    <FavoriteBorder />
                  )}

                </IconButton>

              </span>
            </Tooltip>

            {/* ==================================================
                QUICK VIEW
            ================================================== */}

            <Tooltip
              title="View product"
              arrow
            >
              <IconButton
                className="ab-quick-view"
                onClick={
                  handleQuickView
                }
                aria-label="View product"
              >
                <VisibilityOutlined />
              </IconButton>
            </Tooltip>

            {/* ==================================================
                IMAGE DOTS
            ================================================== */}

            {images.length > 1 && (
              <div className="ab-image-dots">

                {images.map(
                  (_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`ab-image-dot ${
                        currentImage ===
                        index
                          ? "active"
                          : ""
                      }`}
                      onClick={(
                        event
                      ) => {
                        event.stopPropagation();

                        setCurrentImage(
                          index
                        );
                      }}
                      aria-label={`View image ${
                        index + 1
                      }`}
                    />
                  )
                )}

              </div>
            )}

            {/* ==================================================
                IMAGE COUNTER
            ================================================== */}

            {images.length > 1 &&
              isHovered && (
                <div className="ab-image-counter">
                  {currentImage + 1}/
                  {images.length}
                </div>
              )}

            {/* ==================================================
                HOVER OVERLAY
            ================================================== */}

            <div
              className={`ab-image-overlay ${
                isHovered
                  ? "visible"
                  : ""
              }`}
            >
              <span>
                View product
              </span>
            </div>

          </div>

          {/* ==================================================
              PRODUCT INFORMATION
          ================================================== */}

          <div className="ab-product-info">

            {/* Category */}

            <div className="ab-product-category">
              {product?.category?.name ||
                product?.color ||
                "Quality Product"}
            </div>

            {/* Title */}

            <h3 className="ab-product-title">
              {product?.title ||
                "Product"}
            </h3>

            {/* Rating */}

            <div className="ab-rating-row">

              {hasRating ? (
                <>
                  <span className="ab-rating-box">
                    <Star />
                    {rating}
                  </span>

                  <span className="ab-rating-text">
                    Customer rating
                  </span>
                </>
              ) : (
                <span className="ab-no-rating">
                  No ratings yet
                </span>
              )}

            </div>

            {/* Price */}

            <div className="ab-product-price">

              <span className="ab-product-selling">
                ₹
                {formatPrice(
                  sellingPrice
                )}
              </span>

              {hasMrp && (
                <span className="ab-product-mrp">
                  ₹
                  {formatPrice(
                    mrPrice
                  )}
                </span>
              )}

              {hasDiscount && (
                <span className="ab-product-discount">
                  {discountPercent}% off
                </span>
              )}

            </div>

            {/* Bottom */}

            <div className="ab-product-bottom">

              <span className="ab-view-details">
                View details
              </span>

              <span className="ab-arrow">
                →
              </span>

            </div>

          </div>

        </article>

      </div>

      {/* ======================================================
          SNACKBAR
      ====================================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() =>
          setSnackbar(
            (previous) => ({
              ...previous,
              open: false,
            })
          )
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >

        <Alert
          severity={
            snackbar.severity
          }
          variant="filled"
          onClose={() =>
            setSnackbar(
              (previous) => ({
                ...previous,
                open: false,
              })
            )
          }
        >
          {snackbar.message}
        </Alert>

      </Snackbar>
    </>
  );
};

export default ProductCard;