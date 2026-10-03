import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const cards = [
  {
    
    image: "//images/women-red-dress.webp",
    title: "Women's Style",
    sub: "Explore the latest collection",
    category: "Women",
  },
  {
    image: "/images/black-analog-watch.jpg",
    title: "Premium Watches",
    sub: "Everyday to premium",
    category: "Watches",
  },
  {
    image: "/images/android-smartphone-black.jpg",
    title: "Smart Electronics",
    sub: "Latest technology picks",
    category: "Electronics",
  },
  {
    image: "/images/women-yellow-dress-02.jpg",
    title: "Men's Fashion",
    sub: "Fresh arrivals",
    category: "Men",
  },
  {
    image: "/images/acer-laptop.jpg",
    title: "Entertainment",
    sub: "Upgrade your setup",
    category: "Electronics",
  },
  {
    image: "/iphone-purple.jpg",
    title: "Mobiles",
    sub: "Top technology",
    category: "Mobiles",
  },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/products/${encodeURIComponent(category)}`);
  };

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        sm:grid-cols-3
        lg:h-[430px]
        lg:grid-cols-12
        lg:grid-rows-2
        lg:gap-4
      "
    >
      {cards.map((card, index) => (
        <div
          key={`${card.title}-${index}`}
          onClick={() => handleCategoryClick(card.category)}
          className={`
            group
            relative
            cursor-pointer
            overflow-hidden
            rounded-2xl
            bg-slate-100
            shadow-sm
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
            ${
              index === 0 || index === 3
                ? "lg:col-span-3 lg:row-span-2"
                : index === 2 || index === 4
                ? "lg:col-span-4"
                : "lg:col-span-2"
            }
          `}
        >
          {/* Product Image */}
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            className="
              h-full
              min-h-[190px]
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-110
            "
            onError={(event) => {
              event.currentTarget.src =
                "/images/android-smartphone-black.jpg";
            }}
          />

          {/* Image Overlay */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/80
              via-black/20
              to-transparent
              transition
              duration-300
              group-hover:from-black/85
            "
          />

          {/* Top Badge */}
          <div
            className="
              absolute
              left-3
              top-3
              rounded-full
              border
              border-white/20
              bg-black/25
              px-3
              py-1
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-white
              backdrop-blur-md
              sm:text-[10px]
            "
          >
            Amar Bazaar
          </div>

          {/* Content */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0
              p-4
              text-white
              sm:p-5
            "
          >
            <p
              className="
                m-0
                text-sm
                font-extrabold
                tracking-tight
                sm:text-lg
              "
            >
              {card.title}
            </p>

            <p
              className="
                m-0
                mt-1
                text-[10px]
                leading-4
                text-white/75
                sm:text-xs
              "
            >
              {card.sub}
            </p>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleCategoryClick(card.category);
              }}
              className="
                mt-3
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-white
                px-3
                py-1.5
                text-[10px]
                font-extrabold
                text-slate-900
                transition-all
                duration-300
                hover:bg-blue-600
                hover:text-white
                sm:px-4
                sm:py-2
                sm:text-xs
              "
            >
              Shop Now
              <ArrowForwardIcon
                sx={{
                  fontSize: {
                    xs: 13,
                    sm: 15,
                  },
                }}
              />
            </button>
          </div>

          {/* Hover Border */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-2xl
              border
              border-transparent
              transition-all
              duration-300
              group-hover:border-white/40
            "
          />

          {/* Hover Shine */}
          <div
            className="
              pointer-events-none
              absolute
              -left-full
              top-0
              h-full
              w-1/2
              skew-x-[-20deg]
              bg-gradient-to-r
              from-transparent
              via-white/10
              to-transparent
              transition-all
              duration-700
              group-hover:left-[130%]
            "
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;