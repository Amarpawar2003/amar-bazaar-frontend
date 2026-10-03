import React, { useEffect } from "react";
import "./App.css";

import { ThemeProvider } from "@mui/material";

import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./customer/components/Navbar/Navbar";

import customeTheme from "./Theme/customeTheme";

import Home from "./customer/pages/Home/Home";
import Product from "./customer/pages/Product/Product";
import ProductDetails from "./customer/pages/Product Details/ProductDetails";
import Review from "./customer/pages/Review/Review";
import Cart from "./customer/pages/Cart/Cart";
import Checkout from "./customer/pages/Checkout/Checkout";
import Account from "./customer/pages/Account/Account";
import Watchlist from "./customer/pages/Account/Watchlist";
import BecomeSeller from "./customer/pages/Become Seller/BecomeSeller";
import Login from "./customer/pages/Auth/Login";
import Search from "./customer/pages/Search/Search";

import SellerDashboard from "./seller/Pages/SellerDashboard/SellerDashboard";
import AdminDashboard from "./admin/Pages/components/Dashboard/Dashboard";


/* =====================================================
   SCROLL TO TOP ON ROUTE CHANGE
===================================================== */

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}


/* =====================================================
   APP
===================================================== */

function App() {
  return (
    <ThemeProvider theme={customeTheme}>
      <div>

        {/* =========================
            NAVBAR
        ========================= */}

        <Navbar />

        {/* =========================
            SCROLL RESET
        ========================= */}

        <ScrollToTop />

        <Routes>

          {/* =========================
              HOME
          ========================= */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* =========================
              ALL PRODUCTS
          ========================= */}

          <Route
            path="/products"
            element={<Product />}
          />

          {/* =========================
              CATEGORY PRODUCTS
          ========================= */}

          <Route
            path="/products/:category"
            element={<Product />}
          />

          {/* =========================
              LOGIN
          ========================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* =========================
              SEARCH
          ========================= */}

          <Route
            path="/search"
            element={<Search />}
          />

          {/* =========================
              WATCHLIST
          ========================= */}

          <Route
            path="/wishlist"
            element={<Watchlist />}
          />

          {/* =========================
              REVIEWS
          ========================= */}

          <Route
            path="/reviews/:productId"
            element={<Review />}
          />

          {/* =========================
              PRODUCT DETAILS
          ========================= */}

          <Route
            path="/product-details/:categoryId/:name/:productId"
            element={<ProductDetails />}
          />

          {/* =========================
              CART
          ========================= */}

          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* =========================
              CHECKOUT
          ========================= */}

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          {/* =========================
              BECOME SELLER
          ========================= */}

          <Route
            path="/become-seller/*"
            element={<BecomeSeller />}
          />

          {/* =========================
              CUSTOMER ACCOUNT
          ========================= */}

          <Route
            path="/account/*"
            element={<Account />}
          />

          {/* =========================
              SELLER DASHBOARD
          ========================= */}

          <Route
            path="/seller/*"
            element={<SellerDashboard />}
          />

          {/* =========================
              ADMIN DASHBOARD
          ========================= */}

          <Route
            path="/admin/*"
            element={<AdminDashboard />}
          />

        </Routes>

      </div>
    </ThemeProvider>
  );
}

export default App;