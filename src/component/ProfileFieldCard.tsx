import { Divider } from "@mui/material";
import React from "react";

const ProfileFieldCard = ({
  keys,
  value,
}: {
  keys: string;
  value: string;
}) => {
  return (
    <div className="p-5 flex items-center bg-slate-50">
      <p className="w-20 lg:w-36 pr-5">
        {keys}
      </p>

      <Divider orientation="vertical" flexItem />

      <p>{value}</p>
    </div>
  );
};

export default ProfileFieldCard;