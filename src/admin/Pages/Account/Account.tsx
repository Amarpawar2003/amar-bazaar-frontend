import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

const Account: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">

      <div className="flex">

        {/* ================= SIDEBAR ================= */}

        <div className="w-64 border-r min-h-screen p-5">

          <h2 className="text-xl font-semibold mb-6">
            Admin Account
          </h2>

          <div className="space-y-2">

            {/* PROFILE */}

            <button
              type="button"
              onClick={() => navigate("/admin/account")}
              className="block w-full text-left px-4 py-3 rounded hover:bg-gray-100"
            >
              Profile
            </button>

            {/* ADDRESSES */}

            <button
              type="button"
              onClick={() =>
                navigate("/admin/account/addresses")
              }
              className="block w-full text-left px-4 py-3 rounded hover:bg-gray-100"
            >
              Addresses
            </button>

          </div>
        </div>

        {/* ================= CONTENT ================= */}

        <div className="flex-1 p-6">

          <Routes>

            {/* ================= PROFILE ================= */}

            <Route
              index
              element={
                <div>

                  <h1 className="text-2xl font-bold">
                    Admin Account
                  </h1>

                  <p className="text-gray-500 mt-2">
                    Welcome to your admin account.
                  </p>

                </div>
              }
            />

            {/* ================= ADDRESSES ================= */}

            <Route
              path="addresses"
              element={
                <div>

                  <h1 className="text-2xl font-bold">
                    Addresses
                  </h1>

                  <p className="text-gray-500 mt-2">
                    Manage your addresses.
                  </p>

                </div>
              }
            />

          </Routes>

        </div>

      </div>

    </div>
  );
};

export default Account;