import { Box, Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

const AddressFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),

  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Invalid mobile number"),

  pincode: Yup.string()
    .required("Pin code is required")
    .matches(/^[1-9][0-9]{5}$/, "Invalid pin code"),

  address: Yup.string().required("Address is required"),

  city: Yup.string().required("City is required"),

  state: Yup.string().required("State is required"),

  locality: Yup.string().required("Locality is required"),
});

interface AddressFormProps {
  onSave?: (address: any) => void;
}

const AddressForm = ({ onSave }: AddressFormProps) => {

  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      pincode: "",
      address: "",
      city: "",
      state: "",
      locality: "",
    },

    validationSchema: AddressFormSchema,

    onSubmit: (values) => {
      onSave?.(values);
    },
  });

  return (
    <Box sx={{ minWidth: 500, maxWidth: "auto" }}>

      <p className="text-xl font-bold text-center pb-5">
        Contact Details
      </p>

      <form onSubmit={formik.handleSubmit}>

        <Grid container spacing={3}>

          {/* Name */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.name &&
                Boolean(formik.errors.name)
              }
              helperText={
                formik.touched.name &&
                formik.errors.name
              }
            />
          </Grid>

          {/* Mobile */}
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="mobile"
              label="Mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.mobile &&
                Boolean(formik.errors.mobile)
              }
              helperText={
                formik.touched.mobile &&
                formik.errors.mobile
              }
            />
          </Grid>

          {/* Pincode */}
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="pincode"
              label="Pin Code"
              value={formik.values.pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.pincode &&
                Boolean(formik.errors.pincode)
              }
              helperText={
                formik.touched.pincode &&
                formik.errors.pincode
              }
            />
          </Grid>

          {/* Address */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="address"
              label="Address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.address &&
                Boolean(formik.errors.address)
              }
              helperText={
                formik.touched.address &&
                formik.errors.address
              }
            />
          </Grid>

          {/* City */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="city"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.city &&
                Boolean(formik.errors.city)
              }
              helperText={
                formik.touched.city &&
                formik.errors.city
              }
            />
          </Grid>

          {/* State */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="state"
              label="State"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.state &&
                Boolean(formik.errors.state)
              }
              helperText={
                formik.touched.state &&
                formik.errors.state
              }
            />
          </Grid>

          {/* Locality */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="locality"
              label="Locality"
              value={formik.values.locality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.locality &&
                Boolean(formik.errors.locality)
              }
              helperText={
                formik.touched.locality &&
                formik.errors.locality
              }
            />
          </Grid>

          {/* Add Address */}
          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ py: "14px" }}
            >
              Add Address
            </Button>
          </Grid>

        </Grid>

      </form>

    </Box>
  );
};

export default AddressForm;