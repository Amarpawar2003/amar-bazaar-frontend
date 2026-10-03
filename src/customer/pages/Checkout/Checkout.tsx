import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Snackbar,
} from "@mui/material";

import {
  Add,
  CheckCircle,
  CreditCardOutlined,
  HomeOutlined,
  LockOutlined,
  LocationOnOutlined,
  PaymentOutlined,
  SecurityOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import PricingCard from "../Cart/PricingCard";
import { api, getAuthHeaders } from "../../../config/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

/* =========================================================
   LOAD RAZORPAY SCRIPT
========================================================= */

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        resolve(Boolean(window.Razorpay));
      });

      existingScript.addEventListener("error", () => {
        resolve(false);
      });

      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      resolve(Boolean(window.Razorpay));
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

/* =========================================================
   ADDRESS TYPE
========================================================= */

interface AddressData {
  id?: number;
  name: string;
  mobile: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  locality: string;
}

/* =========================================================
   RAZORPAY RESPONSE
========================================================= */

interface RazorpayOrderResponse {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  paymentOrderId: number;
}

/* =========================================================
   CHECKOUT
========================================================= */

const Checkout = () => {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] =
    React.useState(false);

  const [addressLoading, setAddressLoading] =
    React.useState(false);

  const [error, setError] =
    React.useState("");

  const [success, setSuccess] =
    React.useState("");

  const [address, setAddress] =
    React.useState<AddressData>({
      name: "",
      mobile: "",
      pincode: "",
      address: "",
      city: "",
      state: "",
      locality: "",
    });

  const [savedAddresses, setSavedAddresses] =
    React.useState<AddressData[]>([]);

  const [selectedAddressId, setSelectedAddressId] =
    React.useState<number | null>(null);

  const [hasAddress, setHasAddress] =
    React.useState(false);

  const [paymentGateway, setPaymentGateway] =
    React.useState("RAZORPAY");

  /* =======================================================
     PAYMENT GATEWAYS
  ======================================================= */

  const paymentGatewayList = [
    {
      value: "RAZORPAY",
      image: "/images/razorpay-logo.png",
      label: "Razorpay",
    },
  ];

  /* =======================================================
     FETCH ADDRESSES
  ======================================================= */

  const fetchSavedAddresses = async () => {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      navigate("/login");
      return;
    }

    try {
      setAddressLoading(true);
      setError("");

      const response =
        await api.get<AddressData[]>(
          "/users/addresses",
          {
            headers: getAuthHeaders(),
          }
        );

      console.log(
        "SAVED ADDRESSES:",
        response.data
      );

      const addresses =
        (response.data || []).map(
          (item: any) => ({
            id: item.id,

            name:
              item.name || "",

            mobile:
              item.mobile || "",

            pincode:
              item.pinCode ||
              item.pincode ||
              "",

            address:
              item.address || "",

            city:
              item.city || "",

            state:
              item.state || "",

            locality:
              item.locality || "",
          })
        );

      setSavedAddresses(addresses);

      if (addresses.length > 0) {
        const firstAddress =
          addresses[0];

        setSelectedAddressId(
          firstAddress.id ?? null
        );

        setAddress(firstAddress);

        setHasAddress(true);
      } else {
        setSelectedAddressId(null);
        setHasAddress(false);
      }
    } catch (err: any) {
      console.error(
        "FETCH ADDRESSES ERROR:",
        err
      );

      if (
        err?.response?.status === 401 ||
        err?.response?.status === 403
      ) {
        localStorage.removeItem("jwt");
        navigate("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to load saved addresses."
      );
    } finally {
      setAddressLoading(false);
    }
  };

  /* =======================================================
     LOAD ADDRESSES
  ======================================================= */

  React.useEffect(() => {
    void fetchSavedAddresses();
  }, []);

  /* =======================================================
     SAVE ADDRESS
  ======================================================= */

  const handleSaveAddress = async (
    values: AddressData
  ) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.post(
          "/users/addresses",
          {
            name: values.name,
            mobile: values.mobile,
            locality: values.locality,
            address: values.address,
            city: values.city,
            state: values.state,
            pinCode: values.pincode,
          },
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type":
                "application/json",
            },
          }
        );

      console.log(
        "NEW ADDRESS SAVED:",
        response.data
      );

      const saved: AddressData = {
        id: response.data.id,

        name:
          response.data.name ||
          values.name,

        mobile:
          response.data.mobile ||
          values.mobile,

        pincode:
          response.data.pinCode ||
          response.data.pincode ||
          values.pincode,

        locality:
          response.data.locality ||
          values.locality,

        address:
          response.data.address ||
          values.address,

        city:
          response.data.city ||
          values.city,

        state:
          response.data.state ||
          values.state,
      };

      setSavedAddresses(
        (previous) => [
          ...previous,
          saved,
        ]
      );

      setAddress(saved);

      setSelectedAddressId(
        saved.id ?? null
      );

      setHasAddress(true);

      setOpen(false);

      setSuccess(
        "Address saved successfully."
      );
    } catch (err: any) {
      console.error(
        "SAVE ADDRESS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to save address."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     VALIDATE ADDRESS
  ======================================================= */

  const validateAddress = (): boolean => {
    if (!hasAddress) {
      setError(
        "Please add or select a delivery address first."
      );

      return false;
    }

    if (
      !address.name.trim() ||
      !address.mobile.trim() ||
      !address.pincode.trim() ||
      !address.address.trim() ||
      !address.city.trim() ||
      !address.state.trim()
    ) {
      setError(
        "Please enter all required delivery address details."
      );

      return false;
    }

    return true;
  };

  /* =======================================================
     START RAZORPAY
  ======================================================= */

  const startRazorpayPayment =
    async () => {
      const jwt =
        localStorage.getItem("jwt");

      if (!jwt) {
        setError(
          "Please login before making payment."
        );

        navigate("/login");

        return;
      }

      if (!validateAddress()) {
        return;
      }

      if (
        paymentGateway !==
        "RAZORPAY"
      ) {
        setError(
          "Please select Razorpay."
        );

        return;
      }

      try {
        setLoading(true);
        setError("");

        /* ===============================================
           LOAD RAZORPAY
        =============================================== */

        const razorpayLoaded =
          await loadRazorpayScript();

        if (!razorpayLoaded) {
          throw new Error(
            "Razorpay checkout could not be loaded. Please check your internet connection."
          );
        }

        if (!window.Razorpay) {
          throw new Error(
            "Razorpay SDK is not available."
          );
        }

        /* ===============================================
           CREATE ORDER
        =============================================== */

        console.log(
          "Creating Razorpay order..."
        );

        const response =
          await api.post<RazorpayOrderResponse>(
            "/api/orders?paymentMethod=RAZORPAY",
            address,
            {
              headers: {
                ...getAuthHeaders(),
                "Content-Type":
                  "application/json",
              },
            }
          );

        console.log(
          "RAZORPAY ORDER RESPONSE:",
          response.data
        );

        const paymentOrder =
          response.data;

        /* ===============================================
           VALIDATE RESPONSE
        =============================================== */

        if (
          !paymentOrder ||
          !paymentOrder.keyId ||
          !paymentOrder.razorpayOrderId ||
          !paymentOrder.amount ||
          !paymentOrder.paymentOrderId
        ) {
          throw new Error(
            "Invalid Razorpay order response from server."
          );
        }

        /* ===============================================
           RAZORPAY OPTIONS
        =============================================== */

        const options = {
          key: paymentOrder.keyId,

          amount:
            paymentOrder.amount,

          currency:
            paymentOrder.currency ||
            "INR",

          name:
            "Amar Bazaar",

          description:
            "Amar Bazaar Order Payment",

          order_id:
            paymentOrder.razorpayOrderId,

          prefill: {
            name:
              address.name,

            contact:
              address.mobile,
          },

          notes: {
            paymentOrderId:
              String(
                paymentOrder.paymentOrderId
              ),
          },

          theme: {
            color: "#2563eb",
          },

          /* =============================================
             SUCCESS
          ============================================= */

          handler: async (
            paymentResponse: any
          ) => {
            try {
              setLoading(true);
              setError("");
              setSuccess("");

              console.log(
                "RAZORPAY PAYMENT RESPONSE:",
                paymentResponse
              );

              // =============================================
              // VERIFY PAYMENT WITH BACKEND
              // =============================================

              const verifyResponse =
                await api.post(
                  "/api/payment/razorpay/verify",
                  {
                    razorpay_payment_id:
                      paymentResponse.razorpay_payment_id,

                    razorpay_order_id:
                      paymentResponse.razorpay_order_id,

                    razorpay_signature:
                      paymentResponse.razorpay_signature,

                    paymentOrderId:
                      String(
                        paymentOrder.paymentOrderId
                      ),
                  },
                  {
                    headers:
                      getAuthHeaders(),
                  }
                );

              console.log(
                "PAYMENT VERIFY RESPONSE:",
                verifyResponse.data
              );

              // =============================================
              // GET BACKEND PAYMENT STATUS
              // =============================================

              const paymentStatus =
                verifyResponse.data?.status;

              // =============================================
              // PAID
              // =============================================

              if (
                paymentStatus === "PAID" &&
                verifyResponse.data?.success === true
              ) {
                setLoading(false);

                setSuccess(
                  "Payment successful! Your order has been placed."
                );

                setTimeout(() => {
                  navigate(
                    "/account/orders"
                  );
                }, 1200);

                return;
              }

              // =============================================
              // PENDING
              // =============================================

              if (
                paymentStatus === "PENDING"
              ) {
                setLoading(false);

                setError(
                  verifyResponse.data?.message ||
                  "Payment is pending. Please check your order status."
                );

                return;
              }

              // =============================================
              // FAILED
              // =============================================

              if (
                paymentStatus === "FAILED"
              ) {
                setLoading(false);

                setError(
                  verifyResponse.data?.message ||
                  "Payment failed. Please try again."
                );

                return;
              }

              // =============================================
              // UNKNOWN RESPONSE
              // =============================================

              setLoading(false);

              setError(
                verifyResponse.data?.message ||
                "Unable to determine payment status."
              );

            } catch (
              verificationError: any
            ) {
              console.error(
                "PAYMENT VERIFY ERROR:",
                verificationError
              );

              setLoading(false);

              const backendStatus =
                verificationError
                  ?.response
                  ?.data
                  ?.status;

              const backendMessage =
                verificationError
                  ?.response
                  ?.data
                  ?.message;

              // =============================================
              // BACKEND PENDING
              // =============================================

              if (
                backendStatus === "PENDING"
              ) {
                setError(
                  backendMessage ||
                  "Payment is pending. Please check your order status."
                );

                return;
              }

              // =============================================
              // BACKEND FAILED
              // =============================================

              if (
                backendStatus === "FAILED"
              ) {
                setError(
                  backendMessage ||
                  "Payment failed. Please try again."
                );

                return;
              }

              // =============================================
              // OTHER ERROR
              // =============================================

              setError(
                backendMessage ||
                verificationError?.message ||
                "Payment verification failed."
              );
            }
          },

          /* =============================================
             MODAL CLOSED
          ============================================= */

          modal: {
            ondismiss: () => {
              setLoading(false);

              setError(
                "Payment window closed. You can try again."
              );
            },
          },
        };

        /* ===============================================
           OPEN RAZORPAY
        =============================================== */

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.on(
          "payment.failed",
          (failedResponse: any) => {
            console.error(
              "RAZORPAY PAYMENT FAILED:",
              failedResponse
            );

            setLoading(false);

            setError(
              failedResponse?.error
                ?.description ||
                "Payment failed. Please try again."
            );
          }
        );

        razorpay.open();
      } catch (
        paymentError: any
      ) {
        console.error(
          "RAZORPAY START ERROR:",
          paymentError
        );

        setLoading(false);

        setError(
          paymentError?.response
            ?.data?.message ||
            paymentError?.message ||
            "Unable to start payment."
        );
      }
    };

  /* =======================================================
     CHECKOUT
  ======================================================= */

  const handleCheckout = () => {
    void startRazorpayPayment();
  };

  /* =======================================================
     JSX
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-[#f8fafc]
        py-6
        sm:py-8
        md:py-10
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7">

          <div
            className="
              flex
              items-center
              gap-2
              text-blue-600
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
            "
          >
            <PaymentOutlined
              sx={{
                fontSize: 18,
              }}
            />

            Secure Checkout
          </div>

          <h1
            className="
              mt-2
              text-2xl
              sm:text-3xl
              md:text-4xl
              font-extrabold
              tracking-tight
              text-slate-900
            "
          >
            Checkout
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Complete your order by selecting
            a delivery address and payment
            method.
          </p>

        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-5
            lg:gap-6
            items-start
          "
        >

          {/* =================================================
              ADDRESS
          ================================================= */}

          <section
            className="
              lg:col-span-2
              space-y-5
            "
          >

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                shadow-sm
                overflow-hidden
              "
            >

              <div
                className="
                  px-5
                  sm:px-6
                  py-5
                  border-b
                  border-slate-100
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-50
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <LocationOnOutlined
                      sx={{
                        color: "#2563eb",
                        fontSize: 22,
                      }}
                    />
                  </div>

                  <div>

                    <h2
                      className="
                        text-lg
                        font-bold
                        text-slate-900
                      "
                    >
                      Delivery Address
                    </h2>

                    <p
                      className="
                        text-xs
                        text-slate-500
                        mt-0.5
                      "
                    >
                      Select where you want
                      your order delivered.
                    </p>

                  </div>

                </div>

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() =>
                    setOpen(true)
                  }
                  sx={{
                    textTransform:
                      "none",
                    fontWeight: 700,
                    borderRadius: 2,
                  }}
                >
                  Add New Address
                </Button>

              </div>

              <div className="p-4 sm:p-6">

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mb-4
                  "
                >

                  <HomeOutlined
                    sx={{
                      fontSize: 18,
                      color: "#64748b",
                    }}
                  />

                  <p
                    className="
                      text-sm
                      font-bold
                      text-slate-700
                    "
                  >
                    Saved Addresses
                  </p>

                </div>

                {addressLoading ? (

                  <div
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      p-10
                      flex
                      flex-col
                      items-center
                      justify-center
                    "
                  >

                    <CircularProgress
                      size={30}
                    />

                    <p
                      className="
                        mt-3
                        text-sm
                        text-slate-500
                      "
                    >
                      Loading addresses...
                    </p>

                  </div>

                ) : savedAddresses.length >
                  0 ? (

                  <div className="space-y-3">

                    {savedAddresses.map(
                      (item) => (
                        <AddressCard
                          key={item.id}
                          address={item}
                          selected={
                            selectedAddressId ===
                            item.id
                          }
                          onSelect={() => {
                            setSelectedAddressId(
                              item.id ??
                                null
                            );

                            setAddress(item);

                            setHasAddress(
                              true
                            );

                            setError("");
                          }}
                        />
                      )
                    )}

                  </div>

                ) : (

                  <div
                    className="
                      rounded-2xl
                      border
                      border-dashed
                      border-slate-300
                      bg-slate-50
                      p-8
                      text-center
                    "
                  >

                    <LocationOnOutlined
                      sx={{
                        fontSize: 40,
                        color: "#94a3b8",
                      }}
                    />

                    <h3
                      className="
                        mt-3
                        text-base
                        font-bold
                        text-slate-800
                      "
                    >
                      No saved address
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      Add a delivery address
                      to continue.
                    </p>

                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() =>
                        setOpen(true)
                      }
                      sx={{
                        mt: 3,
                        textTransform:
                          "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        boxShadow: "none",
                      }}
                    >
                      Add Address
                    </Button>

                  </div>
                )}

              </div>
            </div>

            {/* SELECTED ADDRESS STATUS */}

            {hasAddress && (
              <div
                className="
                  bg-emerald-50
                  border
                  border-emerald-200
                  rounded-2xl
                  p-4
                  flex
                  items-start
                  gap-3
                "
              >

                <CheckCircle
                  sx={{
                    color: "#059669",
                    fontSize: 22,
                  }}
                />

                <div>

                  <p
                    className="
                      text-sm
                      font-bold
                      text-emerald-800
                    "
                  >
                    Delivery address selected
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-emerald-700
                    "
                  >
                    Your order will be
                    delivered to the selected
                    address.
                  </p>

                </div>

              </div>
            )}

            {/* TRUST FEATURES */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-3
              "
            >

              <div
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-4
                "
              >

                <LockOutlined
                  sx={{
                    color: "#2563eb",
                    fontSize: 21,
                  }}
                />

                <p
                  className="
                    mt-3
                    text-sm
                    font-bold
                    text-slate-800
                  "
                >
                  Secure Checkout
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  Protected payment
                  processing.
                </p>

              </div>

              <div
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-4
                "
              >

                <SecurityOutlined
                  sx={{
                    color: "#059669",
                    fontSize: 21,
                  }}
                />

                <p
                  className="
                    mt-3
                    text-sm
                    font-bold
                    text-slate-800
                  "
                >
                  Safe Payments
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  Payment handled securely
                  by Razorpay.
                </p>

              </div>

              <div
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-4
                "
              >

                <CheckCircle
                  sx={{
                    color: "#7c3aed",
                    fontSize: 21,
                  }}
                />

                <p
                  className="
                    mt-3
                    text-sm
                    font-bold
                    text-slate-800
                  "
                >
                  Easy Ordering
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  Fast and simple checkout.
                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              PAYMENT
          ================================================= */}

          <aside
            className="
              lg:sticky
              lg:top-24
              space-y-4
            "
          >

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                shadow-sm
                overflow-hidden
              "
            >

              <div
                className="
                  p-5
                  border-b
                  border-slate-100
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-purple-50
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <CreditCardOutlined
                      sx={{
                        color:
                          "#7c3aed",
                      }}
                    />

                  </div>

                  <div>

                    <h2
                      className="
                        text-lg
                        font-bold
                        text-slate-900
                      "
                    >
                      Payment Method
                    </h2>

                    <p
                      className="
                        text-xs
                        text-slate-500
                        mt-0.5
                      "
                    >
                      Select your payment
                      method.
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-4">

                <RadioGroup
                  name="payment-method"
                  value={paymentGateway}
                  onChange={(event) =>
                    setPaymentGateway(
                      event.target.value
                    )
                  }
                >

                  {paymentGatewayList.map(
                    (item) => (
                      <FormControlLabel
                        key={item.value}
                        value={item.value}
                        control={<Radio />}
                        label={
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              w-full
                            "
                          >

                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.label
                              }
                              className="
                                w-20
                                h-10
                                object-contain
                              "
                            />

                            <div>

                              <p
                                className="
                                  text-sm
                                  font-bold
                                  text-slate-800
                                "
                              >
                                Razorpay
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-slate-500
                                "
                              >
                                UPI, Cards &
                                Net Banking
                              </p>

                            </div>

                          </div>
                        }
                        sx={{
                          m: 0,
                          width: "100%",
                          minHeight: 74,
                          px: 1,
                          border:
                            "1px solid #e2e8f0",
                          borderRadius:
                            "14px",
                          alignItems:
                            "center",
                          "& .MuiFormControlLabel-label":
                            {
                              flex: 1,
                            },
                        }}
                      />
                    )
                  )}

                </RadioGroup>

              </div>

            </div>

            {/* ORDER SUMMARY */}

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                shadow-sm
                overflow-hidden
              "
            >

              <div className="p-5">

                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  Order Summary
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  Review your order before
                  payment.
                </p>

              </div>

              <PricingCard />

              <div className="p-5">

                <div
                  className="
                    flex
                    items-start
                    gap-2
                    mb-4
                  "
                >

                  <LockOutlined
                    sx={{
                      fontSize: 17,
                      color: "#64748b",
                    }}
                  />

                  <p
                    className="
                      text-xs
                      leading-5
                      text-slate-500
                    "
                  >
                    Your payment details are
                    securely processed by
                    Razorpay.
                  </p>

                </div>

                <Button
                  onClick={
                    handleCheckout
                  }
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.45,
                    borderRadius: 2.5,
                    textTransform:
                      "none",
                    fontWeight: 800,
                    fontSize: "15px",
                    boxShadow: "none",
                  }}
                >

                  {loading ? (
                    <>
                      <CircularProgress
                        size={21}
                        color="inherit"
                        sx={{
                          mr: 1,
                        }}
                      />

                      Processing...
                    </>
                  ) : (
                    <>
                      <LockOutlined
                        sx={{
                          mr: 1,
                          fontSize: 18,
                        }}
                      />

                      Pay Securely
                    </>
                  )}

                </Button>

                <p
                  className="
                    mt-3
                    text-center
                    text-[11px]
                    text-slate-400
                  "
                >
                  Secure payment powered by
                  Razorpay.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </div>

      {/* =====================================================
          ADD ADDRESS MODAL
      ===================================================== */}

      <Modal
        open={open}
        onClose={() =>
          !loading &&
          setOpen(false)
        }
        aria-labelledby="add-address-title"
      >

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform:
              "translate(-50%, -50%)",
            width: {
              xs: "94%",
              sm: "90%",
              md: 620,
            },
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >

          <div
            className="
              mb-5
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-blue-50
                flex
                items-center
                justify-center
              "
            >

              <LocationOnOutlined
                sx={{
                  color: "#2563eb",
                }}
              />

            </div>

            <div>

              <h2
                id="add-address-title"
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                Add Delivery Address
              </h2>

              <p
                className="
                  text-xs
                  text-slate-500
                  mt-1
                "
              >
                Enter your delivery details.
              </p>

            </div>

          </div>

          <AddressForm
            onSave={handleSaveAddress}
          />

        </Box>

      </Modal>

      {/* =====================================================
          ERROR
      ===================================================== */}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={7000}
        onClose={() =>
          setError("")
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >

        <Alert
          severity="error"
          variant="filled"
          onClose={() =>
            setError("")
          }
          sx={{
            width: "100%",
          }}
        >
          {error}
        </Alert>

      </Snackbar>

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={4000}
        onClose={() =>
          setSuccess("")
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >

        <Alert
          severity="success"
          variant="filled"
          onClose={() =>
            setSuccess("")
          }
          sx={{
            width: "100%",
          }}
        >
          {success}
        </Alert>

      </Snackbar>

    </main>
  );
};

export default Checkout;