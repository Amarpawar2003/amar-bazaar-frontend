import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import Orders from "./Orders";
import Watchlist from "./Watchlist";
import Address from "./Address";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5454";

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  mobile?: string;
  role: string;
}

const Account: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ================= EDIT PROFILE STATES =================

  const [isEditing, setIsEditing] =
    useState<boolean>(false);

  const [editFullName, setEditFullName] =
    useState<string>("");

  const [editMobile, setEditMobile] =
    useState<string>("");

  const [saving, setSaving] =
    useState<boolean>(false);

  const [successMessage, setSuccessMessage] =
    useState<string>("");

  // ================= GET PROFILE =================

  const fetchProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        navigate("/login");
        return;
      }

      const response = await axios.get<UserProfile>(
        `${API_BASE_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("PROFILE:", response.data);

      setProfile(response.data);

    } catch (error: unknown) {

      console.error("PROFILE ERROR:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to load profile."
        );
      } else {
        setError("Unable to load profile.");
      }

    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD PROFILE =================

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= START EDIT =================

  const handleEditProfile = (): void => {

    if (!profile) {
      return;
    }

    setEditFullName(
      profile.fullName || ""
    );

    setEditMobile(
      profile.mobile || ""
    );

    setSuccessMessage("");
    setError("");

    setIsEditing(true);
  };

  // ================= CANCEL EDIT =================

  const handleCancelEdit = (): void => {

    setIsEditing(false);

    setEditFullName("");
    setEditMobile("");

    setError("");
    setSuccessMessage("");
  };

  // ================= SAVE PROFILE =================

  const handleSaveProfile = async (): Promise<void> => {

    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      navigate("/login");
      return;
    }

    // ================= VALIDATION =================

    if (!editFullName.trim()) {

      setError("Name is required.");

      return;
    }

    if (!editMobile.trim()) {

      setError("Mobile number is required.");

      return;
    }

    try {

      setSaving(true);

      setError("");
      setSuccessMessage("");

      const response =
        await axios.put<UserProfile>(
          `${API_BASE_URL}/users/profile`,
          {
            fullName: editFullName.trim(),
            mobile: editMobile.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "application/json",
            },
          }
        );

      console.log(
        "PROFILE UPDATED:",
        response.data
      );

      // Update profile UI
      setProfile(response.data);

      // Close edit mode
      setIsEditing(false);

      // Clear form
      setEditFullName("");
      setEditMobile("");

      // Success message
      setSuccessMessage(
        "Profile updated successfully."
      );

    } catch (error: unknown) {

      console.error(
        "UPDATE PROFILE ERROR:",
        error
      );

      if (axios.isAxiosError(error)) {

        setError(
          error.response?.data?.message ||
            "Unable to update profile."
        );

      } else {

        setError(
          "Unable to update profile."
        );
      }

    } finally {

      setSaving(false);
    }
  };

  // ================= LOGOUT =================

  const handleLogout = (): void => {

    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ================= PROFILE UI =================

  const Profile: React.FC = () => {

    if (loading) {

      return (
        <div className="bg-white border rounded-lg p-6">

          <p className="text-gray-500">
            Loading profile...
          </p>

        </div>
      );
    }

    if (error && !isEditing) {

      return (
        <div className="bg-white border rounded-lg p-6">

          <p className="text-red-500">
            {error}
          </p>

        </div>
      );
    }

    if (!profile) {

      return (
        <div className="bg-white border rounded-lg p-6">

          <p className="text-gray-500">
            Profile not found.
          </p>

        </div>
      );
    }

    // =====================================================
    // EDIT PROFILE
    // =====================================================

    if (isEditing) {

      return (
        <div className="bg-white border rounded-lg p-6">

          <h2 className="text-2xl font-bold mb-6">
            Edit Profile
          </h2>

          {/* ERROR */}

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* FULL NAME */}

          <div className="mb-5">

            <label className="block text-gray-600 mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              value={editFullName}
              onChange={(e) =>
                setEditFullName(
                  e.target.value
                )
              }
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-primary-color"
            />

          </div>

          {/* EMAIL */}

          <div className="mb-5">

            <label className="block text-gray-600 mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-md px-4 py-3 cursor-not-allowed"
            />

            <p className="text-sm text-gray-400 mt-1">
              Email cannot be changed.
            </p>

          </div>

          {/* MOBILE */}

          <div className="mb-5">

            <label className="block text-gray-600 mb-2 font-medium">
              Mobile Number
            </label>

            <input
              type="text"
              value={editMobile}
              onChange={(e) =>
                setEditMobile(
                  e.target.value
                )
              }
              placeholder="Enter mobile number"
              className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-primary-color"
            />

          </div>

          {/* ROLE */}

          <div className="mb-6">

            <label className="block text-gray-600 mb-2 font-medium">
              Role
            </label>

            <input
              type="text"
              value={
                profile.role ||
                "ROLE_CUSTOMER"
              }
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-md px-4 py-3 cursor-not-allowed"
            />

          </div>

          {/* BUTTONS */}

          <div className="flex gap-3">

            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-primary-color text-white px-6 py-3 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

          </div>

        </div>
      );
    }

    // =====================================================
    // VIEW PROFILE
    // =====================================================

    return (
      <div className="bg-white border rounded-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          My Profile
        </h2>

        {/* SUCCESS MESSAGE */}

        {successMessage && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
            {successMessage}
          </div>
        )}

        {/* NAME */}

        <div className="mb-5">

          <p className="text-gray-500">
            Name
          </p>

          <h3 className="font-semibold text-lg">
            {profile.fullName ||
              "Not available"}
          </h3>

        </div>

        {/* EMAIL */}

        <div className="mb-5">

          <p className="text-gray-500">
            Email
          </p>

          <h3 className="font-semibold text-lg">
            {profile.email ||
              "Not available"}
          </h3>

        </div>

        {/* MOBILE */}

        <div className="mb-5">

          <p className="text-gray-500">
            Mobile
          </p>

          <h3 className="font-semibold text-lg">
            {profile.mobile ||
              "Not available"}
          </h3>

        </div>

        {/* ROLE */}

        <div className="mb-5">

          <p className="text-gray-500">
            Role
          </p>

          <h3 className="font-semibold text-lg">
            {profile.role ||
              "ROLE_CUSTOMER"}
          </h3>

        </div>

        {/* EDIT PROFILE */}

        <button
          type="button"
          onClick={handleEditProfile}
          className="bg-primary-color text-white px-6 py-3 rounded-md hover:opacity-90"
        >
          Edit Profile
        </button>

      </div>
    );
  };

  // ================= MAIN UI =================

  return (
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-7xl mx-auto px-4">

        {/* PAGE TITLE */}

        <h1 className="text-3xl font-bold mb-8">
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* ================= SIDEBAR ================= */}

          <div className="bg-white border rounded-lg p-4 h-fit">

            <h2 className="font-bold text-lg mb-4">
              Account
            </h2>

            <div className="flex flex-col gap-2">

              {/* PROFILE */}

              <Link
                to="/account"
                className="px-4 py-3 rounded-md hover:bg-gray-100"
              >
                Profile
              </Link>

              {/* ORDERS */}

              <Link
                to="/account/orders"
                className="px-4 py-3 rounded-md hover:bg-gray-100"
              >
                My Orders
              </Link>

              {/* WATCHLIST */}

              <Link
                to="/account/watchlist"
                className="px-4 py-3 rounded-md hover:bg-gray-100"
              >
                ❤️ My Watchlist
              </Link>

              {/* ADDRESSES */}

              <Link
                to="/account/addresses"
                className="px-4 py-3 rounded-md hover:bg-gray-100"
              >
                My Addresses
              </Link>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="text-left px-4 py-3 rounded-md hover:bg-gray-100"
              >
                Logout
              </button>

            </div>

          </div>

          {/* ================= MAIN CONTENT ================= */}

          <div className="md:col-span-3">

            <Routes>

              {/* PROFILE */}

              <Route
                index
                element={<Profile />}
              />

              {/* ORDERS */}

              <Route
                path="orders"
                element={<Orders />}
              />

              {/* WATCHLIST */}

              <Route
                path="watchlist"
                element={<Watchlist />}
              />

              {/* ADDRESSES */}

              <Route
                path="addresses"
                element={<Address />}
              />

            </Routes>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Account;