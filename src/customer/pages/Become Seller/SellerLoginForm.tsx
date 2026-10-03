import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../../seller/Store";

import {
  sendLoginSignupOtp,
  sellerSignin,
} from "../../../State/AuthSlice";

const SellerLoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },

    onSubmit: () => {
      // Login is handled by handleLogin
    },
  });

  const handleSendOtp = () => {
    console.log("SEND OTP CLICKED");

    const email = formik.values.email.trim();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    dispatch(
      sendLoginSignupOtp({
        email,
        role: "ROLE_SELLER",
      })
    );
  };

  const handleLogin = async () => {
    console.log("LOGIN BUTTON CLICKED");

    const email = formik.values.email.trim();
    const otp = formik.values.otp.trim();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      const response = await dispatch(
        sellerSignin({
          email,
          otp,
        })
      );

      console.log("SIGNIN RESPONSE:", response);

      if (sellerSignin.fulfilled.match(response)) {
        console.log("LOGIN SUCCESS:", response.payload);

        localStorage.setItem(
          "jwt",
          response.payload.jwt
        );
        localStorage.setItem(
          "role",
          response.payload.role
        );

        if (response.payload.role === "ROLE_SELLER") {
          navigate("/seller");
        } else {
          alert(
            `This account is ${response.payload.role}. Please use a seller account.`
          );
        }
      } else {
        console.log("LOGIN FAILED:", response);
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
    }
  };

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-primary-color pb-5">
        Login As Seller
      </h1>

      <div className="space-y-5">
        <TextField
          fullWidth
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.email &&
            Boolean(formik.errors.email)
          }
          helperText={
            formik.touched.email &&
            formik.errors.email
          }
        />

        <div className="space-y-2">
          <p className="font-medium text-sm opacity-60">
            Enter OTP sent to your email
          </p>

          <TextField
            fullWidth
            name="otp"
            label="OTP"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.otp &&
              Boolean(formik.errors.otp)
            }
            helperText={
              formik.touched.otp &&
              formik.errors.otp
            }
          />
        </div>

        <Button
          onClick={handleSendOtp}
          fullWidth
          variant="contained"
          sx={{ py: "11px" }}
        >
          Send OTP
        </Button>

        <Button
          onClick={handleLogin}
          fullWidth
          variant="contained"
          sx={{ py: "11px" }}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default SellerLoginForm;