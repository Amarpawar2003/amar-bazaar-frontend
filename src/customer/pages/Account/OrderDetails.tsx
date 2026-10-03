import React from "react";
import { Box, Button, Divider } from "@mui/material";
import { Payments } from "@mui/icons-material";
import axios from "axios";

import OrderStepper from "./OrderStepper";
import { Order } from "./Orders";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5454";

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
}) => {
  const items = order.orderItems || [];

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const orderStatus =
    order.orderStatus?.status || "PENDING";


  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  const paymentStatus =
    order.paymentStatus ||
    order.paymentDetails?.status ||
    "PENDING";


  // =====================================================
  // PAYMENT STATUS DISPLAY
  // =====================================================

  const formattedPaymentStatus =
    paymentStatus === "COMPLETED"
      ? "PAID"
      : paymentStatus === "SUCCESS"
      ? "PAID"
      : paymentStatus === "FAILED"
      ? "FAILED"
      : paymentStatus === "PROCESSING"
      ? "PROCESSING"
      : "PENDING";


  // =====================================================
  // DELIVERY ADDRESS
  // =====================================================

  const address =
    order.shippingAddress;


  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const handleCancelOrder = async () => {

    const jwt =
      localStorage.getItem("jwt");

    if (!jwt) {
      alert("Please login again.");
      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );

    if (!confirmed) {
      return;
    }


    try {

      await axios.put(
        `${API_BASE_URL}/api/orders/${order.id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );


      alert(
        "Order cancelled successfully."
      );


      window.location.reload();

    } catch (error) {

      console.error(
        "Cancel order error:",
        error
      );


      if (
        axios.isAxiosError(error)
      ) {

        alert(
          error.response?.data?.message ||
            "Failed to cancel order."
        );

      } else {

        alert(
          "Failed to cancel order."
        );

      }
    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <Box className="space-y-5">

      {/* =====================================================
          ORDER HEADER
          ===================================================== */}

      <div className="bg-white border rounded-lg p-5">

        <div className="flex justify-between items-center">

          <div>

            <p className="text-xs text-gray-500">
              Order ID
            </p>

            <h2 className="font-bold text-lg">
              #{order.id}
            </h2>

          </div>


          <div className="text-right">

            <p className="text-xs text-gray-500">
              Payment Status
            </p>

            <p
              className={`font-semibold ${
                formattedPaymentStatus ===
                "PAID"
                  ? "text-green-600"
                  : formattedPaymentStatus ===
                    "FAILED"
                  ? "text-red-600"
                  : "text-orange-600"
              }`}
            >
              {formattedPaymentStatus}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          PRODUCTS
          ===================================================== */}

      {items.length > 0 ? (

        items.map((item) => {

          const product =
            item.product;


          const productImage =
            product?.images &&
            product.images.length > 0
              ? product.images[0]
              : "/images/img0.jpg";


          return (

            <div
              key={item.id}
              className="bg-white border rounded-lg p-5"
            >

              <div className="flex flex-col md:flex-row gap-6">

                {/* IMAGE */}

                <div className="flex justify-center md:w-40">

                  <img
                    src={productImage}
                    alt={
                      product?.title ||
                      "Product"
                    }
                    className="w-32 h-32 object-contain"
                    onError={(event) => {
                      event.currentTarget.src =
                        "/images/img0.jpg";
                    }}
                  />

                </div>


                {/* PRODUCT DETAILS */}

                <div className="flex-1 space-y-3">

                  <h2 className="font-bold text-lg">
                    {product?.title ||
                      "Product"}
                  </h2>


                  <p className="text-gray-600">
                    Quantity:{" "}
                    {item.quantity}
                  </p>


                  {item.size && (
                    <p className="font-medium">
                      Size:{" "}
                      {item.size}
                    </p>
                  )}


                  <p className="font-semibold text-lg">
                    ₹{item.sellingPrice}
                  </p>

                </div>

              </div>

            </div>

          );

        })

      ) : (

        <div className="bg-white border rounded-lg p-6">

          <p className="text-gray-500">
            Order items not available.
          </p>

        </div>

      )}


      {/* =====================================================
          ORDER STATUS / DELIVERY TRACKING
          ===================================================== */}

      <section className="bg-white border rounded-lg p-5">

        <h2 className="font-bold mb-5">
          Order Status
        </h2>


        <OrderStepper
          orderStatus={orderStatus}
          orderDate={order.orderDate}
          deliverDate={order.deliverDate}
        />

      </section>


      {/* =====================================================
          DELIVERY ADDRESS
          ===================================================== */}

      <div className="bg-white border rounded-lg p-5">

        <h2 className="font-bold pb-3">
          Delivery Address
        </h2>


        {address ? (

          <div className="text-sm space-y-2">

            {address.name && (
              <p className="font-semibold">
                {address.name}
              </p>
            )}


            {address.mobile && (
              <p>
                Mobile:{" "}
                {address.mobile}
              </p>
            )}


            {address.address && (
              <p>
                {address.address}
              </p>
            )}


            {(address.city ||
              address.state ||
              address.pincode) && (

              <p>

                {address.city || ""}

                {address.city &&
                address.state
                  ? ", "
                  : ""}

                {address.state || ""}

                {address.pincode
                  ? ` - ${address.pincode}`
                  : ""}

              </p>

            )}

          </div>

        ) : (

          <p className="text-gray-500">
            Delivery address not available.
          </p>

        )}

      </div>


      {/* =====================================================
          PRICE
          ===================================================== */}

      <div className="bg-white border rounded-lg">

        <div className="flex justify-between text-sm pt-5 px-5">

          <div className="space-y-1">

            <p className="font-bold">
              Total Item Price
            </p>


            {order.totalMrpPrice >
              order.totalSellingPrice && (

              <p>

                You saved{" "}

                <span className="text-green-500 font-medium">

                  ₹
                  {order.totalMrpPrice -
                    order.totalSellingPrice}

                </span>

              </p>

            )}

          </div>


          <p className="font-bold text-lg">
            ₹{order.totalSellingPrice}
          </p>

        </div>


        {/* =================================================
            PAYMENT
            ================================================= */}

        <div className="px-5 py-5">

          <div
            className={`px-5 py-3 text-xs font-medium flex items-center gap-3 ${
              formattedPaymentStatus ===
              "PAID"
                ? "bg-green-50 text-green-700"
                : formattedPaymentStatus ===
                  "FAILED"
                ? "bg-red-50 text-red-700"
                : "bg-orange-50 text-orange-700"
            }`}
          >

            <Payments />


            <div>

              <p className="font-semibold">
                Payment Status
              </p>


              <p>
                {formattedPaymentStatus}
              </p>

            </div>

          </div>

        </div>


        <Divider />


        {/* =================================================
            SELLER
            ================================================= */}

        <div className="px-5 py-5">

          <p className="text-xs">

            <strong>
              Seller ID:
            </strong>{" "}

            {order.sellerId}

          </p>

        </div>


        {/* =================================================
            CANCEL ORDER
            ================================================= */}

        {orderStatus !== "CANCELLED" &&
          orderStatus !== "DELIVERED" && (

          <div className="p-5">

            <Button
              color="error"
              variant="outlined"
              fullWidth
              sx={{
                py: "0.7rem",
              }}
              onClick={
                handleCancelOrder
              }
            >
              Cancel Order
            </Button>

          </div>

        )}

      </div>

    </Box>
  );
};

export default OrderDetails;