import React from "react";
import OrderTable from "./OrderTable";

const Orders = () => {
  return (
    <div className="text-sm min-h-screen">
      <div className="pb-5">
        <h1 className="font-semibold text-xl">All Orders</h1>

        <p className="text-gray-500">
          Manage seller orders
        </p>
      </div>

      <OrderTable />
    </div>
  );
};

export default Orders;