import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  image: string;
  title: string;
}

const ElectricCategoryCard = ({ image, title }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    let category = title;

    if (title === "Men's Wear") {
      category = "Men";
    } else if (title === "Women's Wear") {
      category = "Women";
    } else if (title === "Entertainment") {
      category = "Electronics";
    }

    navigate(`/products/${encodeURIComponent(category)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group min-w-[100px] cursor-pointer rounded-xl px-2 py-2 text-center transition hover:bg-blue-50"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#f3f6fb] sm:h-20 sm:w-20">
        <img
          className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
          src={image}
          alt={title}
        />
      </div>

      <h2 className="mt-2 text-xs font-bold text-gray-700 sm:text-sm">
        {title}
      </h2>
    </div>
  );
};

export default ElectricCategoryCard;