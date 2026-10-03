import React, { useEffect, useState } from "react";
import axios from "axios";

interface AddressType {
  id: number;
  name: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  mobile: string;
}

interface AddressForm {
  name: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  mobile: string;
}

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5454";

const Address: React.FC = () => {

  const [addresses, setAddresses] =
    useState<AddressType[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [submitting, setSubmitting] =
    useState<boolean>(false);

  const [form, setForm] =
    useState<AddressForm>({
      name: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      mobile: "",
    });

  // =====================================================
  // GET ADDRESSES
  // =====================================================

  const fetchAddresses = async (): Promise<void> => {

    try {

      const jwt =
        localStorage.getItem("jwt");

      if (!jwt) {
        setLoading(false);
        return;
      }

      const response =
        await axios.get<AddressType[]>(
          `${API_BASE_URL}/users/addresses`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

      console.log(
        "ADDRESSES:",
        response.data
      );

      setAddresses(response.data);

    } catch (error) {

      console.error(
        "GET ADDRESS ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {

    const { name, value } =
      e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD ADDRESS
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {

    e.preventDefault();

    try {

      setSubmitting(true);

      const jwt =
        localStorage.getItem("jwt");

      if (!jwt) {

        alert(
          "Please login first."
        );

        return;
      }

      await axios.post(
        `${API_BASE_URL}/users/addresses`,
        form,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      alert(
        "Address added successfully!"
      );

      setForm({
        name: "",
        locality: "",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        mobile: "",
      });

      await fetchAddresses();

    } catch (error) {

      console.error(
        "ADD ADDRESS ERROR:",
        error
      );

      if (axios.isAxiosError(error)) {

        alert(
          error.response?.data?.message ||
            error.response?.data ||
            "Failed to add address."
        );

      } else {

        alert(
          "Failed to add address."
        );
      }

    } finally {

      setSubmitting(false);
    }
  };

  // =====================================================
  // DELETE ADDRESS
  // =====================================================

  const handleDelete = async (
    addressId: number
  ): Promise<void> => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this address?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const jwt =
        localStorage.getItem("jwt");

      if (!jwt) {

        alert(
          "Please login first."
        );

        return;
      }

      await axios.delete(
        `${API_BASE_URL}/users/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      alert(
        "Address deleted successfully!"
      );

      setAddresses((previous) =>
        previous.filter(
          (item) =>
            item.id !== addressId
        )
      );

    } catch (error) {

      console.error(
        "DELETE ADDRESS ERROR:",
        error
      );

      if (axios.isAxiosError(error)) {

        alert(
          error.response?.data?.message ||
            error.response?.data ||
            "Failed to delete address."
        );

      } else {

        alert(
          "Failed to delete address."
        );
      }
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="bg-white border rounded-lg p-6">

      <h2 className="text-2xl font-bold mb-2">
        My Addresses
      </h2>

      <p className="text-gray-500 mb-6">
        Manage your delivery addresses
      </p>

      {/* ================================================= */}
      {/* ADD ADDRESS FORM */}
      {/* ================================================= */}

      <div className="border rounded-lg p-5 mb-8">

        <h3 className="text-lg font-semibold mb-5">
          Add New Address
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >

          {/* NAME */}

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* MOBILE */}

          <input
            type="text"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            required
            className="border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* LOCALITY */}

          <input
            type="text"
            name="locality"
            value={form.locality}
            onChange={handleChange}
            placeholder="Locality"
            className="border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* ADDRESS */}

          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* CITY */}

          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            required
            className="border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* STATE */}

          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            required
            className="border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* PIN CODE */}

          <input
            type="text"
            name="pinCode"
            value={form.pinCode}
            onChange={handleChange}
            placeholder="PIN Code"
            className="border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* BUTTON */}

          <div className="md:col-span-2">

            <button
              type="submit"
              disabled={submitting}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting
                ? "Adding..."
                : "Add Address"}
            </button>

          </div>

        </form>
      </div>

      {/* ================================================= */}
      {/* SAVED ADDRESSES */}
      {/* ================================================= */}

      <div>

        <h3 className="text-lg font-semibold mb-4">
          Saved Addresses
        </h3>

        {loading ? (

          <p className="text-gray-500">
            Loading addresses...
          </p>

        ) : addresses.length === 0 ? (

          <div className="border rounded-lg p-8 text-center">

            <p className="text-gray-500">
              No saved addresses found.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {addresses.map(
              (item) => (

                <div
                  key={item.id}
                  className="border rounded-lg p-5 shadow-sm"
                >

                  <div className="flex justify-between gap-4">

                    <div>

                      <h4 className="font-semibold text-lg">
                        {item.name}
                      </h4>

                      <p className="text-gray-600 mt-2">
                        {item.address}
                      </p>

                      {item.locality && (
                        <p className="text-gray-600">
                          {item.locality}
                        </p>
                      )}

                      <p className="text-gray-600">
                        {item.city},{" "}
                        {item.state}
                        {item.pinCode
                          ? ` - ${item.pinCode}`
                          : ""}
                      </p>

                      <p className="text-gray-600 mt-2">
                        Mobile:{" "}
                        {item.mobile}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      className="text-red-500 hover:text-red-700 font-medium h-fit"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default Address;