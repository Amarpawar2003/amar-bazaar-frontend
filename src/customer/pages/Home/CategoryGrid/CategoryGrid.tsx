import React from "react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    image: "/images/women-pink-saree.jpg",
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
    image: "/images/100-years-tshirt.jpg",
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
    image: "/images/android-smartphone-blue.jpg",
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
            rounded-[22px]
            bg-slate-100
            shadow-[0_8px_30px_rgba(15,23,42,0.08)]
            transition-all
            duration-500
            ease-out
            hover:-translate-y-1.5
            hover:shadow-[0_20px_45px_rgba(15,23,42,0.18)]
            ${
              index === 0 || index === 3
                ? "lg:col-span-3 lg:row-span-2"
                : index === 2 || index === 4
                ? "lg:col-span-4"
                : "lg:col-span-2"
            }
          `}
        >
          {/* IMAGE */}
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            className="
              absolute
              inset-0
              h-full
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

          {/* PREMIUM OVERLAY */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/85
              via-black/25
              to-black/5
              transition-all
              duration-500
              group-hover:from-black/90
              group-hover:via-black/35
            "
          />

          {/* TOP BADGE */}
          <div
            className="
              absolute
              left-4
              top-4
              rounded-full
              border
              border-white/20
              bg-white/10
              px-3
              py-1.5
              text-[9px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-white
              backdrop-blur-md
              sm:left-5
              sm:top-5
              sm:text-[10px]
            "
          >
            Amar Bazaar
          </div>

          {/* ARROW */}
          <div
            className="
              absolute
              right-4
              top-4
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-white/10
              text-white
              opacity-0
              backdrop-blur-md
              transition-all
              duration-300
              group-hover:opacity-100
              group-hover:rotate-0
              sm:right-5
              sm:top-5
            "
          >
            <span className="text-lg leading-none">↗</span>
          </div>

          {/* CONTENT */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0
              z-10
              p-4
              sm:p-5
            "
          >
            {/* SMALL LINE */}
            <div
              className="
                mb-3
                h-[2px]
                w-8
                rounded-full
                bg-white/80
                transition-all
                duration-500
                group-hover:w-14
              "
            />

            <h3
              className="
                text-base
                font-black
                leading-tight
                tracking-tight
                text-white
                sm:text-xl
                lg:text-[21px]
              "
            >
              {card.title}
            </h3>

            <p
              className="
                mt-1.5
                line-clamp-2
                text-xs
                leading-5
                text-white/80
                sm:text-sm
              "
            >
              {card.sub}
            </p>

            {/* SHOP NOW */}
            <div
              className="
                mt-3
                flex
                translate-y-2
                items-center
                gap-1.5
                text-xs
                font-extrabold
                text-white
                opacity-0
                transition-all
                duration-300
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              <span>Shop Now</span>

              <span
                className="
                  text-sm
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </div>
          </div>

          {/* BOTTOM GLOW */}
          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              h-1
              w-0
              bg-white
              transition-all
              duration-500
              group-hover:w-full
            "
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;