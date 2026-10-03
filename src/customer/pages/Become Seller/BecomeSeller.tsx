import React, { useState } from "react";
import SellerAccountForm from "./SellerAccountForm";
import SellerLoginForm from "./SellerLoginForm";
import { Button } from "@mui/material";

const BecomeSeller = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="grid md:gap-10 grid-cols-3 min-h-screen">
      <section
        className="lg:col-span-1 md:col-end-2 col-span-3 p-10 shadow-lg
        rounded-b-md"
      >

        {!isLogin ? <SellerLoginForm /> : <SellerAccountForm />}

        <div className="mt-10 space-y-2">
          <h1 className="text-center text-sm font-medium">
            {isLogin ? "Don't have account" : "Have account"}
          </h1>

          <Button
            onClick={() => setIsLogin(!isLogin)}
            fullWidth
            sx={{ py: "11px" }}
            variant="outlined"
          >
            {isLogin ? "Register" : "Login"}
          </Button>
        </div>

      </section>

      <section className="hidden md:col-span-1 lg:col-span-2
       md:flex justify-center items-center">

        <div className="lg:w-[100%] px-10 space-y-10">
            <div className="space-y-2 font-bold text-center">   

            </div>
            <img src="/images/amar.png" alt="" />

        </div>

      </section>
    </div>
  );
};

export default BecomeSeller;