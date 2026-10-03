import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "../seller/Pages/SellerDashboard/Dashboard";
import Products from "../seller/Pages/Products/Products";
import AddProduct from "../seller/Pages/Products/AddProduct";
import Orders from "../seller/Pages/Orders/Orders";
import Profile from "../seller/Pages/Account/Profile";
import Payment from "../seller/Pages/Payment/Payment";
import Transaction from "../seller/Pages/Payment/Transaction";

const SellerRoutes = () => {
  return (
    <div>
      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/add-product"
          element={<AddProduct />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/account"
          element={<Profile />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        <Route
          path="/transaction"
          element={<Transaction />}
        />

      </Routes>
    </div>
  );
};

export default SellerRoutes;