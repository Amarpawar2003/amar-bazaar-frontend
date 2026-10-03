import React from "react";

const Dashboard = () => {
  return (
    <div>

      <h1 className="font-bold mb-5 text-xl">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        <div className="border rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold text-lg">
            Total Products
          </h2>

          <p className="text-3xl font-bold mt-3">
            0
          </p>
        </div>

        <div className="border rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold text-lg">
            Total Orders
          </h2>

          <p className="text-3xl font-bold mt-3">
            0
          </p>
        </div>

        <div className="border rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold text-lg">
            Total Sales
          </h2>

          <p className="text-3xl font-bold mt-3">
            ₹0
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;