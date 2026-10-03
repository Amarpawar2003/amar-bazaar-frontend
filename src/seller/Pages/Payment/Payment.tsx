import { Button, Card, Divider } from "@mui/material";
import React from "react";
import TransactionTable from "./Transaction";

const Payment = () => {
  return (
    <div className="space-y-5">
      <Card className="rounded-md space-y-4 p-5">
        <h1 className="text-gray-600 font-medium">
          Total Earning
        </h1>

        <h1 className="font-bold text-xl pb-1">
          ₹11644
        </h1>

        <Divider />

        <p className="text-gray-600 font-medium pt-1">
          Last Payment : <strong>₹0</strong>
        </p>
      </Card>

      <div className="pt-20 space-y-5">
        <Button variant="contained">
          Transaction
        </Button>

        <TransactionTable />
      </div>
    </div>
  );
};

export default Payment;