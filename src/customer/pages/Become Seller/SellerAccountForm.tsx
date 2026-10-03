import { Button, Step, StepLabel, Stepper } from "@mui/material";
import React, { useState } from "react";
import { useFormik } from "formik";

import BecomeSellerFormStep1 from "./BecomeSellerFormStep1";
import BecomeSellerFormStep2 from "./BecomeSellerFormStep2";
import BecomeSellerFormStep3 from "./BecomeSellerFormStep3";
import BecomeSellerFormStep4 from "./BecomeSellerFormStep4";

const steps = [
  "Tax Details & Mobile",
  "Pickup Address",
  "Bank Details",
  "Supplier Details",
];

const SellerAccountForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  const formik = useFormik({
    initialValues: {
      mobile: "",
      otp: "",
      GSTIN: "",

      name: "",
      pincode: "",
      address: "",
      city: "",
      state: "",
      locality: "",

      bankDetails: {
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
      },

      businessDetails: {
        businessName: "",
      },

      sellerName: "",
      email: "",
      password: "",
    },

    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleStep = (value: number) => () => {
    if (activeStep > 0 && value === -1) {
      setActiveStep(activeStep + value);
    }

    if (activeStep < steps.length - 1 && value === 1) {
      setActiveStep(activeStep + value);
    }

    if (activeStep === steps.length - 1 && value === 1) {
      handleCreateAccount();
    }
  };

  const handleCreateAccount = () => {
    console.log("create account");
    console.log(formik.values);
  };

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 ? (
        <BecomeSellerFormStep1 formik={formik} />
      ) : null}

      {activeStep === 1 ? (
        <BecomeSellerFormStep2 formik={formik} />
      ) : null}

      {activeStep === 2 ? (
        <BecomeSellerFormStep3 formik={formik} />
      ) : null}

      {activeStep === 3 ? (
        <BecomeSellerFormStep4 formik={formik} />
      ) : null}

      <section></section>

      <div className="flex items-center justify-between">
        <Button
          variant="contained"
          disabled={activeStep === 0}
          onClick={handleStep(-1)}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={handleStep(1)}
        >
          {activeStep === steps.length - 1
            ? "Create Account"
            : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default SellerAccountForm;