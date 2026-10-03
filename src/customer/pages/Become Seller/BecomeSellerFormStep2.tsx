import { Box, Grid, TextField } from "@mui/material";
import React from "react";

const BecomeSellerFormStep2 = ({ formik }: any) => {
  return (
    <Box>
      <p className="text-xl font-bold text-center pb-5">
        pickup Address
      </p>

      <>
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

        </Grid>
      </>
    </Box>
  );
};

export default BecomeSellerFormStep2;