import { Box } from "@mui/material";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

interface OrderStepperProps {
  orderStatus?: string;
  orderDate?: string;
  deliverDate?: string;
}

const OrderStepper: React.FC<OrderStepperProps> = ({
  orderStatus,
  orderDate,
  deliverDate,
}) => {

  const status =
    orderStatus || "PENDING";


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date?: string
  ) => {

    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };


  // =====================================================
  // DELIVERY DATE TEXT
  // =====================================================

  const getDeliveryText = () => {

    if (!deliverDate) {
      return "Delivery date not available";
    }

    const delivery =
      new Date(deliverDate);

    if (
      Number.isNaN(
        delivery.getTime()
      )
    ) {
      return "Delivery date not available";
    }

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const deliveryDay =
      new Date(delivery);

    deliveryDay.setHours(
      0,
      0,
      0,
      0
    );

    const difference =
      Math.round(
        (
          deliveryDay.getTime() -
          today.getTime()
        ) /
          (1000 * 60 * 60 * 24)
      );


    if (status === "DELIVERED") {

      return `Delivered on ${formatDate(
        deliverDate
      )}`;
    }


    if (difference === 0) {

      return "Arriving Today";
    }


    if (difference === 1) {

      return "Arriving Tomorrow";
    }


    if (difference > 1) {

      return `Expected delivery: ${formatDate(
        deliverDate
      )}`;
    }


    return `Expected delivery: ${formatDate(
      deliverDate
    )}`;
  };


  // =====================================================
  // STEPS
  // =====================================================

  const steps = [
    {
      name: "Order Placed",
      description: orderDate
        ? `Placed on ${formatDate(
            orderDate
          )}`
        : "Order placed",
      value: "PENDING",
    },

    {
      name: "Packed",
      description:
        status === "PENDING"
          ? "Waiting for seller confirmation"
          : "Order packed",
      value: "CONFIRMED",
    },

    {
      name: "Shipped",
      description:
        status === "SHIPPED" ||
        status === "ARRIVING" ||
        status === "DELIVERED"
          ? "Order shipped"
          : "Waiting for shipment",
      value: "SHIPPED",
    },

    {
      name: "Out for Delivery",
      description:
        status === "ARRIVING"
          ? getDeliveryText()
          : status === "DELIVERED"
          ? "Delivered successfully"
          : "Waiting for delivery",
      value: "ARRIVING",
    },

    {
      name: "Delivered",
      description:
        status === "DELIVERED"
          ? getDeliveryText()
          : deliverDate
          ? `Expected by ${formatDate(
              deliverDate
            )}`
          : "Delivery pending",
      value: "DELIVERED",
    },
  ];


  // =====================================================
  // CANCELLED
  // =====================================================

  if (status === "CANCELLED") {

    return (
      <Box className="my-10">

        <div className="flex">

          <div className="flex flex-col items-center">

            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-50">

              <FiberManualRecordIcon
                sx={{
                  fontSize: "18px",
                  color: "#20b486",
                }}
              />

            </div>

            <div className="w-[2px] h-20 bg-teal-300" />

          </div>

          <div className="ml-3 pt-1">

            <p className="font-medium text-gray-800">
              Order Placed
            </p>

            <p className="text-xs text-gray-400">
              {orderDate
                ? `Placed on ${formatDate(
                    orderDate
                  )}`
                : "Order placed"}
            </p>

          </div>

        </div>


        <div className="flex">

          <div className="flex flex-col items-center">

            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-50">

              <FiberManualRecordIcon
                sx={{
                  fontSize: "18px",
                  color: "#ef4444",
                }}
              />

            </div>

          </div>

          <div className="ml-3 pt-1">

            <p className="font-medium text-red-600">
              Order Cancelled
            </p>

            <p className="text-xs text-gray-400">
              Order has been cancelled
            </p>

          </div>

        </div>

      </Box>
    );
  }


  // =====================================================
  // CURRENT STEP
  // =====================================================

  let currentStep = 0;


  if (status === "PENDING") {
    currentStep = 0;
  }

  if (status === "CONFIRMED") {
    currentStep = 1;
  }

  if (status === "SHIPPED") {
    currentStep = 2;
  }

  if (status === "ARRIVING") {
    currentStep = 3;
  }

  if (status === "DELIVERED") {
    currentStep = 4;
  }


  // =====================================================
  // UI
  // =====================================================

  return (
    <Box className="my-10">

      {/* DELIVERY SUMMARY */}

      <div className="mb-8 rounded-lg bg-gray-50 border p-5">

        <p className="text-sm text-gray-500">
          Delivery
        </p>

        <p className="font-bold text-lg mt-1">

          {getDeliveryText()}

        </p>

        {deliverDate &&
          status !== "DELIVERED" && (

          <p className="text-sm text-gray-500 mt-1">

            Expected delivery:{" "}

            {formatDate(
              deliverDate
            )}

          </p>

        )}

      </div>


      {/* STEPS */}

      {steps.map(
        (step, index) => {

          const completed =
            index <= currentStep;

          return (

            <div
              className="flex"
              key={step.value}
            >

              {/* DOT + LINE */}

              <div className="flex flex-col items-center">

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    completed
                      ? "bg-teal-50"
                      : "bg-gray-100"
                  }`}
                >

                  <FiberManualRecordIcon
                    sx={{
                      fontSize: "18px",
                      color:
                        completed
                          ? "#20b486"
                          : "#d1d5db",
                    }}
                  />

                </div>


                {index !==
                  steps.length - 1 && (

                  <div
                    className={`w-[2px] h-20 ${
                      index <
                      currentStep
                        ? "bg-teal-300"
                        : "bg-gray-300"
                    }`}
                  />

                )}

              </div>


              {/* TEXT */}

              <div className="ml-3 pt-1">

                <p
                  className={`font-medium ${
                    completed
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {step.name}
                </p>

                <p className="text-xs text-gray-400">
                  {step.description}
                </p>

              </div>

            </div>

          );
        }
      )}

    </Box>
  );
};

export default OrderStepper;