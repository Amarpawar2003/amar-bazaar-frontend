import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  image: string;
  title: string;
}

const ShopByCategoryCard = ({ image, title }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    let category = title;

    if (title === "Indian & Fusion Wear" || title === "Women's Fashion") {
      category = "Women";
    } else if (title === "Men's Fashion") {
      category = "Men";
    } else if (title === "Electronics") {
      category = "Electronics";
    } else if (title === "Footwear") {
      category = "Footwear";
    } else if (title === "Watches") {
      category = "Watches";
    }

    navigate(`/products/${encodeURIComponent(category)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer rounded-2xl border border-[#e7eaf0] bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden rounded-xl bg-[#f4f6fa]">
        <img
          src={image}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          alt={title}
        />
      </div>

      <h3 className="mt-3 text-xs font-extrabold text-gray-700 sm:text-sm">
        {title}
      </h3>
    </div>
  );
};

export default ShopByCategoryCard;