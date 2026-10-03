import React, { useState } from "react";
import { Button, TextField } from "@mui/material";

const AddNewCouponForm = () => {
  const [couponCode, setCouponCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [validityStartDate, setValidityStartDate] = useState("");
  const [validityEndDate, setValidityEndDate] = useState("");
  const [minimumOrderValue, setMinimumOrderValue] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      couponCode,
      discountPercentage,
      validityStartDate,
      validityEndDate,
      minimumOrderValue,
    });
  };

  return (
    <div className="w-full max-w-2xl">

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-2 gap-3">

          <TextField
            fullWidth
            label="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />

          <TextField
            fullWidth
            type="number"
            label="Discount Percentage"
            value={discountPercentage}
            onChange={(e) =>
              setDiscountPercentage(Number(e.target.value))
            }
          />

          <TextField
            fullWidth
            type="date"
            label="Validity Start Date"
            value={validityStartDate}
            onChange={(e) =>
              setValidityStartDate(e.target.value)
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            fullWidth
            type="date"
            label="Validity End Date"
            value={validityEndDate}
            onChange={(e) =>
              setValidityEndDate(e.target.value)
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

        </div>

        <div className="mt-3">

          <TextField
            fullWidth
            type="number"
            label="Minimum Order Value"
            value={minimumOrderValue}
            onChange={(e) =>
              setMinimumOrderValue(Number(e.target.value))
            }
          />

        </div>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          className="bg-primary-color mt-3"
        >
          CREATE COUPON
        </Button>

      </form>

    </div>
  );
};

export default AddNewCouponForm;