import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  TextField,
} from "@mui/material";

import {
  ArrowBack,
  LocalOffer,
  LockOutlined,
  ShoppingBagOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import CartItem from "./CartItem";
import PricingCard from "./PricingCard";

import { api } from "../../../config/api";

interface CartItemData {
  id: number;
  quantity?: number;
  size?: string;
  color?: string;
  product?: any;
}

interface CartData {
  id: number;
  carItems: CartItemData[];
  totalMrpPrice: number;
  totalSellingPrice: number;
  discount: number;
  totalItem: number;
}

const Cart = () => {
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");

  const [cart, setCart] =
    useState<CartData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     FETCH CART
  ===================================================== */

  const fetchCart = useCallback(async () => {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<CartData>(
          "/api/cart",
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

      console.log(
        "CART RESPONSE:",
        response.data
      );

      setCart(response.data);
    } catch (err: any) {
      console.error(
        "ERROR FETCHING CART:",
        err
      );

      console.error(
        "CART ERROR RESPONSE:",
        err?.response?.data
      );

      const status =
        err?.response?.status;

      if (
        status === 401 ||
        status === 403
      ) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to load your cart. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  /* =====================================================
     COUPON
  ===================================================== */

  const handleCouponChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCouponCode(event.target.value);
  };

  /* =====================================================
     CHECKOUT
  ===================================================== */

  const handleCheckout = () => {
    if (
      !cart ||
      !cart.carItems ||
      cart.carItems.length === 0
    ) {
      return;
    }

    navigate("/checkout");
  };

  /* =====================================================
     CONTINUE SHOPPING
  ===================================================== */

  const handleContinueShopping = () => {
    navigate("/");
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            md:px-8
            lg:px-12
            py-12
          "
        >

          <div
            className="
              flex
              min-h-[55vh]
              flex-col
              items-center
              justify-center
            "
          >

            <CircularProgress
              size={42}
              thickness={4}
            />

            <p
              className="
                mt-5
                text-sm
                font-medium
                text-slate-500
              "
            >
              Loading your cart...
            </p>

          </div>

        </div>

      </main>
    );
  }

  const cartItems =
    cart?.carItems || [];

  const isCartEmpty =
    cartItems.length === 0;

  /* =====================================================
     MAIN
  ===================================================== */

  return (
    <main
      className="
        min-h-screen
        bg-[#f8fafc]
        py-6
        sm:py-8
        md:py-10
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          md:px-8
          lg:px-12
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7">

          <button
            type="button"
            onClick={
              handleContinueShopping
            }
            className="
              inline-flex
              items-center
              gap-1.5
              text-sm
              font-semibold
              text-slate-500
              hover:text-blue-600
              transition
              mb-4
            "
          >

            <ArrowBack
              sx={{
                fontSize: 18,
              }}
            />

            Continue Shopping

          </button>

          <p
            className="
              mb-1
              text-xs
              font-bold
              uppercase
              tracking-[.16em]
              text-blue-600
            "
          >
            Shopping bag
          </p>

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-end
              sm:justify-between
              gap-2
            "
          >

            <div>

              <h1
                className="
                  m-0
                  text-2xl
                  sm:text-3xl
                  md:text-4xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                "
              >
                My Cart
              </h1>

              {!isCartEmpty && (
                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  {cart?.totalItem ||
                    cartItems.length}{" "}
                  {(cart?.totalItem ||
                    cartItems.length) === 1
                    ? "item"
                    : "items"}{" "}
                  in your shopping bag
                </p>
              )}

            </div>

            {!isCartEmpty && (
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-xs
                  font-medium
                  text-slate-500
                "
              >

                <LockOutlined
                  sx={{
                    fontSize: 17,
                  }}
                />

                Secure checkout

              </div>
            )}

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-5">

            <Alert
              severity="error"
              variant="filled"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() =>
                    void fetchCart()
                  }
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>

          </div>
        )}

        {/* =================================================
            EMPTY CART
        ================================================= */}

        {isCartEmpty ? (

          <section
            className="
              bg-white
              border
              border-slate-200
              rounded-3xl
              shadow-sm
              px-5
              py-16
              sm:px-10
              md:py-20
              text-center
            "
          >

            <div
              className="
                mx-auto
                w-20
                h-20
                rounded-full
                bg-blue-50
                flex
                items-center
                justify-center
              "
            >

              <ShoppingBagOutlined
                sx={{
                  fontSize: 40,
                  color: "#2563eb",
                }}
              />

            </div>

            <h2
              className="
                mt-6
                text-2xl
                md:text-3xl
                font-extrabold
                text-slate-900
              "
            >
              Your cart is empty
            </h2>

            <p
              className="
                mt-2
                max-w-md
                mx-auto
                text-sm
                md:text-base
                text-slate-500
              "
            >
              Looks like you haven't added
              anything to your cart yet.
              Start shopping and find
              something you love.
            </p>

            <Button
              variant="contained"
              onClick={
                handleContinueShopping
              }
              startIcon={
                <ShoppingBagOutlined />
              }
              sx={{
                mt: 4,
                px: 4,
                py: 1.25,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
              }}
            >
              Continue Shopping
            </Button>

          </section>

        ) : (

          /* =================================================
             CART CONTENT
          ================================================= */

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-5
              lg:gap-6
              items-start
            "
          >

            {/* =================================================
                CART ITEMS
            ================================================= */}

            <section
              className="
                lg:col-span-2
                space-y-4
              "
            >

              <div
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  shadow-sm
                  overflow-hidden
                "
              >

                <div
                  className="
                    px-5
                    py-4
                    sm:px-6
                    border-b
                    border-slate-100
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <h2
                      className="
                        text-lg
                        sm:text-xl
                        font-bold
                        text-slate-900
                      "
                    >
                      Cart Items
                    </h2>

                    <p
                      className="
                        text-xs
                        text-slate-500
                        mt-1
                      "
                    >
                      Review your products
                      before checkout
                    </p>

                  </div>

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-blue-50
                      text-blue-700
                      text-xs
                      font-bold
                    "
                  >
                    {cartItems.length}{" "}
                    {cartItems.length === 1
                      ? "Product"
                      : "Products"}
                  </span>

                </div>

                <div
                  className="
                    p-3
                    sm:p-5
                    space-y-3
                  "
                >

                  {cartItems.map(
                    (item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onCartUpdated={
                          fetchCart
                        }
                      />
                    )
                  )}

                </div>

              </div>

              {/* =================================================
                  TRUST INFORMATION
              ================================================= */}

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-3
                  gap-3
                "
              >

                <div
                  className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-4
                  "
                >

                  <p
                    className="
                      text-sm
                      font-bold
                      text-slate-800
                    "
                  >
                    Secure Payments
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >
                    Your payment is
                    securely processed.
                  </p>

                </div>

                <div
                  className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-4
                  "
                >

                  <p
                    className="
                      text-sm
                      font-bold
                      text-slate-800
                    "
                  >
                    Easy Checkout
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >
                    Simple and fast
                    ordering experience.
                  </p>

                </div>

                <div
                  className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-4
                  "
                >

                  <p
                    className="
                      text-sm
                      font-bold
                      text-slate-800
                    "
                  >
                    Amar Bazaar
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >
                    Shop from our
                    marketplace.
                  </p>

                </div>

              </div>

            </section>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <aside
              className="
                lg:col-span-1
                space-y-4
                lg:sticky
                lg:top-28
              "
            >

              {/* =================================================
                  COUPON
              ================================================= */}

              <div
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  shadow-sm
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mb-4
                  "
                >

                  <div
                    className="
                      w-9
                      h-9
                      rounded-xl
                      bg-emerald-50
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <LocalOffer
                      sx={{
                        color: "#059669",
                        fontSize: 19,
                      }}
                    />

                  </div>

                  <div>

                    <h3
                      className="
                        text-sm
                        font-bold
                        text-slate-900
                      "
                    >
                      Apply Coupon
                    </h3>

                    <p
                      className="
                        text-xs
                        text-slate-500
                        mt-0.5
                      "
                    >
                      Have a coupon code?
                    </p>

                  </div>

                </div>

                <div
                  className="
                    flex
                    gap-2
                  "
                >

                  <TextField
                    fullWidth
                    size="small"
                    value={couponCode}
                    onChange={
                      handleCouponChange
                    }
                    placeholder="Coupon code"
                    variant="outlined"
                  />

                  <Button
                    variant="outlined"
                    disabled={
                      !couponCode.trim()
                    }
                    sx={{
                      minWidth: 76,
                      textTransform:
                        "none",
                      fontWeight: 700,
                      borderRadius: 2,
                    }}
                  >
                    Apply
                  </Button>

                </div>

                <p
                  className="
                    mt-3
                    text-[11px]
                    text-slate-400
                  "
                >
                  Coupon application will
                  be available when the
                  coupon service is connected.
                </p>

              </div>

              {/* =================================================
                  PRICE DETAILS
              ================================================= */}

              <div
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  shadow-sm
                  overflow-hidden
                "
              >

                <div
                  className="
                    p-5
                    pb-2
                  "
                >

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    Price Details
                  </h2>

                </div>

                <PricingCard />

                <Divider />

                <div className="p-5">

                  <div
                    className="
                      flex
                      items-start
                      gap-2
                      mb-4
                      text-xs
                      text-slate-500
                    "
                  >

                    <LockOutlined
                      sx={{
                        fontSize: 16,
                      }}
                    />

                    <span>
                      Secure checkout with
                      protected payment processing.
                    </span>

                  </div>

                  <Button
                    onClick={
                      handleCheckout
                    }
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      py: 1.4,
                      borderRadius: 2.5,
                      textTransform:
                        "none",
                      fontWeight: 800,
                      fontSize: "15px",
                      boxShadow: "none",
                    }}
                  >
                    Proceed to Checkout
                  </Button>

                </div>

              </div>

            </aside>

          </div>
        )}

      </div>

    </main>
  );
};

export default Cart;