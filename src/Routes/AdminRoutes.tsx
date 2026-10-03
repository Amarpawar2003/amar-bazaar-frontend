import React from "react";
import { Route, Routes } from "react-router-dom";

import SellersTable from "../admin/Pages/Sellers/SellersTable";
import Coupon from "../admin/Pages/Coupon/Coupon";
import AddNewCouponForm from "../admin/Pages/Coupon/AddNewCouponForm";
import GridTable from "../admin/Pages/HomeGrid/GridTable";
import ElectronicsableT from "../admin/Pages/ElectronicsCategory/ElectronicsableT";
import Deal from "../admin/Pages/Deals/Deal";
import Account from "../admin/Pages/Account/Account";

const AdminRoutes = () => {
  return (
    <div>
      <Routes>

        <Route
          path="/"
          element={<SellersTable />}
        />

        <Route
          path="/sellers"
          element={<SellersTable />}
        />

        <Route
          path="/coupon"
          element={<Coupon />}
        />

        <Route
          path="/add-coupon"
          element={<AddNewCouponForm />}
        />

        <Route
          path="/home-grid"
          element={<GridTable />}
        />

        <Route
          path="/electronics-category"
          element={<ElectronicsableT />}
        />

        <Route
          path="/deals"
          element={<Deal />}
        />

        <Route
          path="/account"
          element={<Account />}
        />

      </Routes>
    </div>
  );
};

export default AdminRoutes;