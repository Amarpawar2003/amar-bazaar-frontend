import { Radio } from "@mui/material";
import React from "react";

interface AddressCardProps {
  address?: any;
  selected?: boolean;
  onSelect?: () => void;
}

const AddressCard = ({
  address,
  selected = false,
  onSelect,
}: AddressCardProps) => {
  const current = address || {
    name: "amar",
    mobile: "8530368871",
    address: "Ambajogai shivaji chowk",
    locality: "",
    city: "Ambajogai",
    state: "Maharashtra",
    pincode: "431517",
  };

  return (
    <div
      className={`p-5 border rounded-md flex cursor-pointer ${
        selected ? "border-primary-color" : ""
      }`}
      onClick={onSelect}
    >
      <div>
        <Radio
          checked={selected}
          onChange={onSelect}
          value="address"
          name="saved-address"
        />
      </div>

      <div className="space-y-2 pt-3">
        <h1 className="font-semibold">{current.name}</h1>
        <p className="w-[320px]">
          {current.address}
          {current.locality ? `, ${current.locality}` : ""},{" "}
          {current.city}, {current.state} - {current.pincode}
        </p>
        <p>
          <strong>Mobile :</strong> {current.mobile}
        </p>
      </div>
    </div>
  );
};

export default AddressCard;
