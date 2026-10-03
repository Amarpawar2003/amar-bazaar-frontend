import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderDetails from "./OrderDetails";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5454";

export interface OrderItem {
  id: number;
  quantity: number;
  size?: string;
  sellingPrice: number;

  product?: {
    id: number;
    title: string;
    images?: string[];
  };
}

export interface Order {
  id: number;

  totalMrpPrice: number;

  totalSellingPrice: number;

  totalItem: number;

  sellerId: number;

  /*
   * Payment status coming directly
   * from Order entity.
   *
   * Expected values:
   * PENDING
   * PROCESSING
   * COMPLETED
   * FAILED
   */
  paymentStatus?: string;

  /*
   * Order creation date.
   */
  orderDate?: string;

  /*
   * Expected delivery date.
   */
  deliverDate?: string;

  shippingAddress?: {
    id?: number;
    name?: string;
    mobile?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  /*
   * Order status is different from
   * payment status.
   *
   * Example:
   * PENDING
   * CONFIRMED
   * SHIPPED
   * ARRIVING
   * DELIVERED
   * CANCELLED
   */
  orderStatus?: {
    status?: string;
  };

  /*
   * Old embedded payment status.
   * Kept as fallback for old data.
   */
  paymentDetails?: {
    status?: string;
  };

  orderItems?: OrderItem[];
}

const Orders = () => {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // FETCH USER ORDERS
  // =====================================================

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        setLoading(true);

        setError("");


        const jwt =
          localStorage.getItem("jwt");


        if (!jwt) {

          setError(
            "Please login to view your orders."
          );

          setLoading(false);

          return;
        }


        const response =
          await axios.get<Order[]>(
            `${API_BASE_URL}/api/orders/user`,
            {
              headers: {
                Authorization:
                  `Bearer ${jwt}`,
              },
            }
          );


        console.log(
          "USER ORDERS:",
          response.data
        );


        /*
         * Make sure response is an array.
         */
        const receivedOrders =
          Array.isArray(response.data)
            ? response.data
            : [];


        /*
         * Normalize payment status.
         *
         * paymentStatus is preferred.
         *
         * paymentDetails.status is used
         * only as fallback for old orders.
         */
        const normalizedOrders =
          receivedOrders.map(
            (order) => ({

              ...order,

              paymentStatus:
                order.paymentStatus ||
                order.paymentDetails?.status ||
                "PENDING",

            })
          );


        console.log(
          "NORMALIZED ORDERS:",
          normalizedOrders
        );


        setOrders(
          normalizedOrders
        );


      } catch (error) {

        console.error(
          "Failed to fetch orders:",
          error
        );


        if (
          axios.isAxiosError(error)
        ) {

          setError(
            error.response?.data
              ?.message ||
            "Failed to load orders."
          );

        } else {

          setError(
            "Failed to load orders."
          );

        }

      } finally {

        setLoading(false);

      }
    };


    fetchOrders();

  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="text-center py-10">

        <p className="text-gray-600">
          Loading your orders...
        </p>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="bg-white border rounded-lg p-6">

        <p className="text-red-500">
          {error}
        </p>

      </div>
    );
  }


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="text-sm min-h-screen">

      {/* =================================================
          PAGE HEADER
          ================================================= */}

      <div className="pb-5">

        <h1 className="text-2xl font-bold">
          My Orders
        </h1>

        <p className="text-gray-500 mt-1">
          Your recent orders
        </p>

      </div>


      {/* =================================================
          NO ORDERS
          ================================================= */}

      {orders.length === 0 ? (

        <div className="bg-white border rounded-lg p-8 text-center">

          <h2 className="text-xl font-semibold mb-2">
            No Orders Found
          </h2>

          <p className="text-gray-500">
            You have not placed any orders yet.
          </p>

        </div>

      ) : (

        /* =================================================
           ORDERS
           ================================================= */

        <div className="space-y-6">

          {orders.map(
            (order) => (

              <OrderDetails
                key={order.id}
                order={order}
              />

            )
          )}

        </div>

      )}

    </div>
  );
};

export default Orders;