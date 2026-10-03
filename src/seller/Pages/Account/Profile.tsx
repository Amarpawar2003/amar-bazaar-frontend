import { Edit } from "@mui/icons-material";
import { Avatar, Box, IconButton } from "@mui/material";
import React from "react";

const Profile = () => {
  return (
    <div className="px-10 py-10">

      {/* Personal Details */}
      <section className="relative">

        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">
            Personal Details
          </h1>

          <IconButton
            className="bg-primary-color text-white"
            sx={{
              backgroundColor: "#20B486",
              color: "white",
              "&:hover": {
                backgroundColor: "#20B486",
              },
              width: "55px",
              height: "55px",
            }}
          >
            <Edit />
          </IconButton>
        </div>

        <div className="py-5">
          <Avatar
            src="/images/eagle.jpg"
            sx={{
              width: 135,
              height: 135,
            }}
          />
        </div>

        <Box className="bg-gray-50">

          <div className="flex items-center border-b p-5">
            <p className="w-[150px] text-gray-600">
              Name
            </p>

            <p className="font-bold">
              Amar pawar
            </p>
          </div>

          <div className="flex items-center border-b p-5">
            <p className="w-[150px] text-gray-600">
              Email
            </p>

            <p className="font-bold">
              amarpawar9764@gmail.com
            </p>
          </div>

          <div className="flex items-center p-5">
            <p className="w-[150px] text-gray-600">
              Mobile
            </p>

            <p className="font-bold">
              8530368871
            </p>
          </div>

        </Box>
      </section>


      {/* Bussiness Details */}
      <section className="relative mt-20">

        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">
            Bussiness Details
          </h1>

          <IconButton
            sx={{
              backgroundColor: "#20B486",
              color: "white",
              "&:hover": {
                backgroundColor: "#20B486",
              },
              width: "55px",
              height: "55px",
            }}
          >
            <Edit />
          </IconButton>
        </div>

        <Box className="bg-gray-50 mt-5">

          <div className="flex items-center border-b p-5">
            <p className="w-[150px] text-gray-600">
              Business Name/Brand Name
            </p>

            <p className="font-bold">
              Virani Clothing
            </p>
          </div>

          <div className="flex items-center border-b p-5">
            <p className="w-[150px] text-gray-600">
              GSTIN
            </p>

            <p className="font-bold">
              GSTIN3447633
            </p>
          </div>

          <div className="flex items-center p-5">
            <p className="w-[150px] text-gray-600">
              Account Status
            </p>

            <p className="font-bold">
              PENDING
            </p>
          </div>

        </Box>
      </section>


      {/* Pickup Address */}
      <section className="relative mt-20">

        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">
            Pickup Address
          </h1>

          <IconButton
            sx={{
              backgroundColor: "#20B486",
              color: "white",
              "&:hover": {
                backgroundColor: "#20B486",
              },
              width: "55px",
              height: "55px",
            }}
          >
            <Edit />
          </IconButton>
        </div>

        <Box className="bg-gray-50 mt-5">

          <div className="flex items-center border-b p-5">
            <p className="w-[150px] text-gray-600">
              Adress
            </p>

            <p className="font-bold">
              Hinjewadi
            </p>
          </div>

          <div className="flex items-center border-b p-5">
            <p className="w-[150px] text-gray-600">
              City
            </p>

            <p className="font-bold">
              Pune
            </p>
          </div>

          <div className="flex items-center border-b p-5">
            <p className="w-[150px] text-gray-600">
              State
            </p>

            <p className="font-bold">
              Maharashtra
            </p>
          </div>

          <div className="flex items-center p-5">
            <p className="w-[150px] text-gray-600">
              Mobile
            </p>

            <p className="font-bold">
              8530368871
            </p>
          </div>

        </Box>
      </section>


      {/* Bank Details */}
      <section className="relative mt-20">

        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">
            Bank Details
          </h1>

          <IconButton
            sx={{
              backgroundColor: "#20B486",
              color: "white",
              "&:hover": {
                backgroundColor: "#20B486",
              },
              width: "55px",
              height: "55px",
            }}
          >
            <Edit />
          </IconButton>
        </div>

        <Box className="bg-gray-50 mt-5">

          <div className="flex items-center border-b p-5">
            <p className="w-[150px] text-gray-600">
              Account Holder Name
            </p>

            <p className="font-bold">
              Amar pawar
            </p>
          </div>

          <div className="flex items-center border-b p-5">
            <p className="w-[150px] text-gray-600">
              Account Number
            </p>

            <p className="font-bold">
              67893447633
            </p>
          </div>

          <div className="flex items-center border-b p-5">
            <p className="w-[150px] text-gray-600">
              IFSC CODE
            </p>

            <p className="font-bold">
              YES834
            </p>
          </div>

          <div className="flex items-center p-5">
            <p className="w-[150px] text-gray-600">
              Bank Name
            </p>

            <p className="font-bold">
              SBI
            </p>
          </div>

        </Box>
      </section>

    </div>
  );
};

export default Profile;