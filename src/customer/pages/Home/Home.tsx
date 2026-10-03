import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";

import {
  ArrowForward,
  ArrowBackIosNew,
  ArrowForwardIos,
  LocalShippingOutlined,
  SecurityOutlined,
  Storefront,
  VerifiedOutlined,
  ShoppingBagOutlined,
  LocalOfferOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import ElectricCategory from "./ElectricCategory";
import CategoryGrid from "./CategoryGrid/CategoryGrid";
import Deal from "./Deal/Deal";
import ShopeByCategory from "./ShopByCategory/ShopeByCategory";

import ProductCard from "../Product/ProductCard";

// IMPORTANT: Home.tsx is inside:
// src/customer/pages/Home
// config/api is inside:
// src/config/api
import { api } from "../../../config/api";


// =====================================================
// PRODUCT TYPE
// =====================================================

export interface ProductData {
  id: number;
  title: string;
  description: string;
  mrPrice: number;
  sellingPrice: number;
  discountPercent: number;
  quantity: number;
  color: string;
  images: string[];
  numRatings: number;

  category?: {
    id?: number;
    name?: string;
  };

  seller?: {
    id?: number;
    sellerName?: string;
    name?: string;
  };

  createdAt?: string;
  Sizes?: string;
}


// =====================================================
// PRODUCT API RESPONSE
// =====================================================

interface ProductResponse {
  content: ProductData[];
  totalPages: number;
  totalElements: number;
  number: number;
}


// =====================================================
// HERO SLIDES
// =====================================================

const heroSlides = [
  {
    id: 1,
    badge: "MEGA SALE • LIMITED TIME",
    title: "Big deals.",
    highlight: "Bigger savings.",
    description: "Discover amazing products and exciting offers across Amar Bazaar.",
    primaryButton: "Shop Now",
    secondaryButton: "Explore Deals",
    image: "/images/portable-air-cooler.png",
    gradient: "from-[#0b4fd8] via-[#1769ff] to-[#5b8cff]",
    primaryRoute: "/products",
    secondaryRoute: "/products",
  },
  {
    id: 2,
    badge: "FASHION • NEW COLLECTION",
    title: "Upgrade your",
    highlight: "everyday style.",
    description: "Discover fresh fashion collections for men and women at great prices.",
    primaryButton: "Shop Fashion",
    secondaryButton: "View Products",
    image: "/images/banarasi-saree-collection.webp",
    gradient: "from-[#be185d] via-[#db2777] to-[#f472b6]",
    primaryRoute: "/products/Women",
    secondaryRoute: "/products",
  },
  {
    id: 3,
    badge: "ELECTRONICS • SMART CHOICE",
    title: "Power up your",
    highlight: "smart lifestyle.",
    description: "Explore electronics, gadgets and everyday technology from trusted sellers.",
    primaryButton: "Shop Electronics",
    secondaryButton: "Explore",
    image: "/images/android-smartphone-black.jpg",
    gradient: "from-[#312e81] via-[#4338ca] to-[#6366f1]",
    primaryRoute: "/products/Electronics",
    secondaryRoute: "/products",
  },
  {
    id: 4,
    badge: "MEN'S FASHION • FRESH ARRIVALS",
    title: "Look sharp.",
    highlight: "Feel confident.",
    description: "Explore the latest men's fashion, shirts, footwear and everyday essentials.",
    primaryButton: "Shop Men",
    secondaryButton: "Explore",
    image: "/images/100-years-tshirt.jpg",
    gradient: "from-[#172033] via-[#334155] to-[#64748b]",
    primaryRoute: "/products/Men",
    secondaryRoute: "/products",
  },
  {
    id: 5,
    badge: "WOMEN'S COLLECTION • TRENDING",
    title: "Your style.",
    highlight: "Your story.",
    description: "Discover beautiful women's fashion, Indian wear and trending collections.",
    primaryButton: "Shop Women",
    secondaryButton: "Explore",
    image: "/images/women-pink-saree.jpg",
    gradient: "from-[#7c2d12] via-[#c2410c] to-[#fb923c]",
    primaryRoute: "/products/Women",
    secondaryRoute: "/products",
  },
  {
    id: 6,
    badge: "FOOTWEAR • NEW ARRIVALS",
    title: "Step into",
    highlight: "something new.",
    description: "Discover sneakers, sandals and everyday footwear from trusted sellers.",
    primaryButton: "Shop Footwear",
    secondaryButton: "Explore",
    image: "/images/black-running-shoes-02.jpg",
    gradient: "from-[#14532d] via-[#15803d] to-[#4ade80]",
    primaryRoute: "/products/Footwear",
    secondaryRoute: "/products",
  },
];


// =====================================================
// HOME
// =====================================================

const Home = () => {

  const navigate = useNavigate();


  // =====================================================
  // HERO STATE
  // =====================================================

  const [
    activeSlide,
    setActiveSlide,
  ] = useState(0);


  // =====================================================
  // PRODUCTS STATE
  // =====================================================

  const [
    products,
    setProducts,
  ] = useState<ProductData[]>([]);

  const [
    productPage,
    setProductPage,
  ] = useState(0);

  const [
    totalProductPages,
    setTotalProductPages,
  ] = useState(1);

  const [
    productsLoading,
    setProductsLoading,
  ] = useState(true);

  const [
    loadingMoreProducts,
    setLoadingMoreProducts,
  ] = useState(false);

  const [
    productError,
    setProductError,
  ] = useState("");

  // =====================================================
  // HORIZONTAL PRODUCT SLIDER
  // =====================================================

  const [featuredProductIndex, setFeaturedProductIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;

    const timer = setInterval(() => {
      setFeaturedProductIndex(
        (current) => (current + 1) % products.length
      );
    }, 2000);

    return () => clearInterval(timer);
  }, [products.length]);


  // =====================================================
  // INFINITE SCROLL REFS
  // =====================================================

  const loadingRef =
    useRef(false);

  const observerRef =
    useRef<IntersectionObserver | null>(
      null
    );


  // =====================================================
  // AUTO HERO SLIDER
  // =====================================================

  useEffect(() => {

    const timer =
      setInterval(() => {

        setActiveSlide(
          (current) =>
            (current + 1) %
            heroSlides.length
        );

      }, 2000);

    return () => {
      clearInterval(timer);
    };

  }, []);


  // =====================================================
  // PREVIOUS SLIDE
  // =====================================================

  const previousSlide = () => {

    setActiveSlide(
      (current) =>
        current === 0
          ? heroSlides.length - 1
          : current - 1
    );

  };


  // =====================================================
  // NEXT SLIDE
  // =====================================================

  const nextSlide = () => {

    setActiveSlide(
      (current) =>
        (current + 1) %
        heroSlides.length
    );

  };


  // =====================================================
  // CURRENT SLIDE
  // =====================================================

  const slide =
    heroSlides[activeSlide];


  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchHomeProducts =
    useCallback(
      async (
        pageNumber: number,
        reset: boolean = false
      ) => {

        try {

          if (reset) {

            setProductsLoading(true);

          } else {

            setLoadingMoreProducts(true);

          }

          setProductError("");


          const response =
            await api.get<ProductResponse>(
              "/products",
              {
                params: {
                  pageNumber:
                    pageNumber,
                },
              }
            );


          const productList:
            ProductData[] =
            response.data?.content || [];


          console.log(
            "HOME PRODUCTS:",
            productList
          );


          // ==========================================
          // FIRST PAGE
          // ==========================================

          if (reset) {

            setProducts(
              productList
            );

          }


          // ==========================================
          // NEXT PAGE
          // ==========================================

          else {

            setProducts(
              (
                previous: ProductData[]
              ) => {

                const existingIds =
                  new Set<number>(
                    previous.map(
                      (
                        product: ProductData
                      ) =>
                        product.id
                    )
                  );


                const newProducts =
                  productList.filter(
                    (
                      product: ProductData
                    ) =>
                      !existingIds.has(
                        product.id
                      )
                  );


                return [
                  ...previous,
                  ...newProducts,
                ];

              }
            );

          }


          // ==========================================
          // PAGINATION DATA
          // ==========================================

          setProductPage(
            pageNumber
          );


          setTotalProductPages(
            response.data?.totalPages ||
              1
          );


        } catch (
          error: any
        ) {

          console.error(
            "HOME PRODUCT ERROR:",
            error
          );


          console.error(
            "HOME PRODUCT ERROR DATA:",
            error?.response?.data
          );


          setProductError(
            error?.response?.data
              ?.message ||
            "Unable to load products."
          );


        } finally {

          setProductsLoading(
            false
          );

          setLoadingMoreProducts(
            false
          );

          loadingRef.current =
            false;

        }

      },
      []
    );


  // =====================================================
  // FIRST PRODUCT LOAD
  // =====================================================

  useEffect(() => {

    setProducts([]);

    setProductPage(0);

    setTotalProductPages(1);

    setProductError("");

    loadingRef.current =
      false;


    fetchHomeProducts(
      0,
      true
    );

  }, [
    fetchHomeProducts,
  ]);


  // =====================================================
  // LOAD MORE PRODUCTS
  // =====================================================

  const loadMoreProducts =
    useCallback(
      () => {

        if (
          loadingRef.current
        ) {
          return;
        }


        if (
          productPage + 1 >=
          totalProductPages
        ) {
          return;
        }


        loadingRef.current =
          true;


        fetchHomeProducts(
          productPage + 1,
          false
        );

      },
      [
        productPage,
        totalProductPages,
        fetchHomeProducts,
      ]
    );


  // =====================================================
  // INFINITE SCROLL OBSERVER
  // =====================================================

  const productsBottomRef =
    useCallback(
      (
        node: HTMLDivElement | null
      ) => {

        if (
          loadingRef.current
        ) {
          return;
        }


        if (
          observerRef.current
        ) {

          observerRef.current.disconnect();

        }


        observerRef.current =
          new IntersectionObserver(
            (
              entries
            ) => {

              if (
                entries[0]
                  ?.isIntersecting
              ) {

                loadMoreProducts();

              }

            },
            {
              rootMargin:
                "500px 0px",
            }
          );


        if (node) {

          observerRef.current.observe(
            node
          );

        }

      },
      [
        loadMoreProducts,
      ]
    );


  // =====================================================
  // CLEANUP OBSERVER
  // =====================================================

  useEffect(() => {

    return () => {

      if (
        observerRef.current
      ) {

        observerRef.current.disconnect();

      }

    };

  }, []);


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <main
      className="
        ab-page
        pb-16
      "
    >


      {/* =================================================
          HERO SLIDER
      ================================================= */}

      <section
        className="
          ab-section
          pt-4
          sm:pt-6
        "
      >

        <div
          className={`
            relative
            min-h-[400px]
            overflow-hidden
            rounded-3xl
            bg-gradient-to-r
            ${slide.gradient}
            text-white
            shadow-[0_20px_50px_rgba(15,23,42,0.16)]
            transition-all
            duration-700
            hover:shadow-[0_25px_70px_rgba(15,23,42,0.22)]
          `}
        >

          {/* Decorative circles */}

          <div
            className="
              absolute
              -right-24
              -top-24
              h-80
              w-80
              rounded-full
              bg-white/10
            "
          />

          <div
            className="
              absolute
              -bottom-32
              right-20
              h-96
              w-96
              rounded-full
              bg-white/5
            "
          />

          <div
            className="
              absolute
              left-1/3
              top-10
              h-40
              w-40
              rounded-full
              border
              border-white/10
            "
          />


          {/* HERO CONTENT */}

          <div
            className="
              relative
              z-10
              grid
              min-h-[400px]
              items-center
              gap-8
              px-6
              py-10
              sm:px-10
              lg:grid-cols-2
              lg:px-16
            "
          >

            {/* LEFT */}

            <div
              key={`content-${slide.id}`}
              className="
                max-w-xl
                animate-[fadeIn_.6s_ease-in-out]
              "
            >

              {/* Badge */}

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-4
                  py-2
                  text-[10px]
                  font-bold
                  tracking-wide
                  backdrop-blur
                  sm:text-xs
                "
              >

                <LocalOfferOutlined
                  sx={{
                    fontSize: 15,
                  }}
                />

                {slide.badge}

              </div>


              {/* Heading */}

              <h1
                className="
                  text-3xl
                  font-black
                  leading-[1.08]
                  tracking-tight
                  sm:text-5xl
                  lg:text-6xl
                "
              >

                {slide.title}

                <br />

                <span
                  className="
                    text-[#ffd45a]
                  "
                >
                  {slide.highlight}
                </span>

              </h1>


              {/* Description */}

              <p
                className="
                  mt-5
                  max-w-lg
                  text-sm
                  leading-6
                  text-blue-50
                  sm:text-base
                "
              >
                {slide.description}
              </p>


              {/* Buttons */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-3
                "
              >

                <Button
                  onClick={() =>
                    navigate(
                      slide.primaryRoute
                    )
                  }
                  variant="contained"
                  endIcon={
                    <ArrowForward />
                  }
                  sx={{
                    bgcolor: "#ffb400",
                    color: "#172033",
                    fontWeight: 800,
                    textTransform:
                      "none",
                    borderRadius:
                      "11px",
                    px: 3,
                    py: 1.2,
                    boxShadow: "none",

                    "&:hover": {
                      bgcolor:
                        "#ffc533",
                      boxShadow:
                        "0 8px 20px rgba(0,0,0,.15)",
                    },
                  }}
                >
                  {slide.primaryButton}
                </Button>


                <Button
                  onClick={() =>
                    navigate(
                      slide.secondaryRoute
                    )
                  }
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor:
                      "rgba(255,255,255,.45)",
                    textTransform:
                      "none",
                    borderRadius:
                      "11px",
                    px: 3,
                    py: 1.2,
                    fontWeight: 700,

                    "&:hover": {
                      borderColor:
                        "white",
                      background:
                        "rgba(255,255,255,.08)",
                    },
                  }}
                >
                  {slide.secondaryButton}
                </Button>

              </div>

            </div>


            {/* RIGHT IMAGE */}

            <div
              key={`image-${slide.id}`}
              className="
                relative
                hidden
                h-[300px]
                items-center
                justify-center
                lg:flex
              "
            >

              <div
                className="
                  absolute
                  h-64
                  w-64
                  rounded-full
                  bg-white/10
                  blur-[1px]
                "
              />

              <div
                className="
                  absolute
                  h-72
                  w-72
                  rounded-full
                  border
                  border-white/10
                "
              />

              <img
                src={slide.image}
                alt="Amar Bazaar"
                className="
                  relative
                  z-10
                  max-h-[285px]
                  max-w-[90%]
                  object-contain
                  drop-shadow-[0_25px_25px_rgba(0,0,0,.25)]
                  transition-all
                  duration-700
                  ease-out
                  hover:scale-110
                  hover:-translate-y-2
                "
              />

            </div>

          </div>


          {/* PREVIOUS BUTTON */}

          <IconButton
            onClick={
              previousSlide
            }
            aria-label="Previous slide"
            sx={{
              position:
                "absolute",
              left: {
                xs: 8,
                lg: 18,
              },
              top: "50%",
              transform:
                "translateY(-50%)",
              width: 42,
              height: 42,
              color: "white",
              background:
                "rgba(255,255,255,.14)",
              backdropFilter:
                "blur(8px)",

              "&:hover": {
                background:
                  "rgba(255,255,255,.25)",
              },
            }}
          >

            <ArrowBackIosNew
              sx={{
                fontSize: 17,
              }}
            />

          </IconButton>


          {/* NEXT BUTTON */}

          <IconButton
            onClick={
              nextSlide
            }
            aria-label="Next slide"
            sx={{
              position:
                "absolute",
              right: {
                xs: 8,
                lg: 18,
              },
              top: "50%",
              transform:
                "translateY(-50%)",
              width: 42,
              height: 42,
              color: "white",
              background:
                "rgba(255,255,255,.14)",
              backdropFilter:
                "blur(8px)",

              "&:hover": {
                background:
                  "rgba(255,255,255,.25)",
              },
            }}
          >

            <ArrowForwardIos
              sx={{
                fontSize: 17,
              }}
            />

          </IconButton>


          {/* SLIDER DOTS */}

          <div
            className="
              absolute
              bottom-5
              left-1/2
              flex
              -translate-x-1/2
              items-center
              gap-2
            "
          >

            {heroSlides.map(
              (
                _,
                index
              ) => (

                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${
                    index + 1
                  }`}
                  onClick={() =>
                    setActiveSlide(
                      index
                    )
                  }
                  className={`
                    h-2
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      activeSlide ===
                      index
                        ? "w-7 bg-white"
                        : "w-2 bg-white/50"
                    }
                  `}
                />

              )
            )}

          </div>


          {/* PROGRESS BAR */}

          <div
            className="
              absolute
              bottom-0
              left-0
              h-[3px]
              bg-[#ffd45a]
            "
            style={{
              width: "100%",
            }}
          />

        </div>

      </section>

      {/* =================================================
          PREMIUM PRODUCT STRIP
      ================================================= */}
      {!productsLoading && products.length > 0 && (
        <section className="ab-section pt-3 sm:pt-4">
          <div className="border-t border-slate-200 pt-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <p className="m-0 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#1769ff]">
                  Trending now
                </p>
                <h3 className="m-0 mt-0.5 text-sm font-extrabold text-slate-900 sm:text-base">
                  Popular products
                </h3>
              </div>
              <button type="button" onClick={() => navigate("/products")} className="text-xs font-bold text-[#1769ff] transition hover:text-blue-800">
                View all →
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
              <div className="flex w-full gap-2 sm:gap-3">
                {Array.from({ length: Math.min(6, products.length) }, (_, offset) => products[(featuredProductIndex + offset) % products.length]).map((product) => (
                  <div
                    key={`featured-${product.id}`}
                    onClick={() => navigate(`/product-details/${product.id}`)}
                    className="group min-w-0 w-[calc(50%-4px)] shrink-0 cursor-pointer rounded-xl border border-slate-100 bg-white p-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-100 hover:bg-slate-50 hover:shadow-sm sm:w-[calc(33.333%-8px)] md:w-[calc(25%-9px)] lg:w-[calc(20%-10px)] xl:w-[calc(16.666%-10px)]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-50 sm:h-16 sm:w-16">
                        <img
                          src={product.images?.[0] || "/images/portable-air-cooler.png"}
                          alt={product.title}
                          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                          onError={(event) => { event.currentTarget.src = "/images/portable-air-cooler.png"; }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="m-0 truncate text-[11px] font-bold text-slate-800 sm:text-xs">{product.title}</p>
                        <p className="m-0 mt-1 text-xs font-extrabold text-[#1769ff]">₹{product.sellingPrice?.toLocaleString("en-IN")}</p>
                        {product.discountPercent > 0 && (
                          <p className="m-0 mt-0.5 text-[10px] font-semibold text-green-600">{product.discountPercent}% OFF</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {products.length > 1 && (
              <div className="mt-2 flex justify-center gap-1">
                {Array.from({ length: Math.min(products.length, 6) }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Product slide ${index + 1}`}
                    onClick={() => setFeaturedProductIndex(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${featuredProductIndex % Math.min(products.length, 6) === index ? "w-5 bg-[#1769ff]" : "w-2 bg-slate-300"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* =================================================
          TRUST FEATURES
      ================================================= */}

      <section
        className="
          ab-section
          pt-4
          sm:pt-6
        "
      >

        <div
          className="
            ab-card
            grid
            grid-cols-2
            divide-x
            overflow-hidden
            sm:grid-cols-4
          "
        >

          {[
            [
              <LocalShippingOutlined />,
              "Fast Delivery",
              "Reliable shipping",
            ],

            [
              <VerifiedOutlined />,
              "Quality Products",
              "Trusted sellers",
            ],

            [
              <SecurityOutlined />,
              "Secure Payments",
              "Protected checkout",
            ],

            [
              <Storefront />,
              "Easy Selling",
              "Grow your business",
            ],

          ].map(
            (
              [icon, title, sub],
              index
            ) => (

              <div
                key={index}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-4
                  transition
                  hover:bg-slate-50
                  sm:px-6
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-50
                    text-[#1769ff]
                  "
                >
                  {icon}
                </div>

                <div>

                  <p
                    className="
                      m-0
                      text-xs
                      font-extrabold
                      sm:text-sm
                    "
                  >
                    {title as string}
                  </p>

                  <p
                    className="
                      m-0
                      mt-0.5
                      text-[10px]
                      text-gray-500
                      sm:text-xs
                    "
                  >
                    {sub as string}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </section>


      {/* =================================================
          ELECTRONICS
      ================================================= */}

      <section
        className="
          ab-section
          pt-7
        "
      >

        <ElectricCategory />

      </section>


      {/* =================================================
          FEATURED COLLECTIONS
      ================================================= */}

      <section
        className="
          ab-section
          pt-7
        "
      >

        <div
          className="
            ab-section-title
          "
        >

          <div>

            <h2>
              Featured collections
            </h2>

            <p>
              Trending picks for every kind of shopper
            </p>

          </div>


          <button
            onClick={() =>
              navigate(
                "/products"
              )
            }
            className="
              flex
              items-center
              gap-1
              text-sm
              font-bold
              text-[#1769ff]
              transition
              hover:text-blue-800
            "
          >

            View all

            <ArrowForward
              sx={{
                fontSize: 16,
              }}
            />

          </button>

        </div>


        <CategoryGrid />

      </section>


      {/* =================================================
          DEALS
      ================================================= */}

      <section
        className="
          ab-section
          pt-10
        "
      >

        <div
          className="
            ab-section-title
          "
        >

          <div>

            <h2>
              Deals of the day
            </h2>

            <p>
              Fresh offers, limited-time prices
            </p>

          </div>


          <button
            onClick={() =>
              navigate(
                "/products"
              )
            }
            className="
              flex
              items-center
              gap-1
              text-sm
              font-bold
              text-[#1769ff]
              transition
              hover:text-blue-800
            "
          >

            View all

            <ArrowForward
              sx={{
                fontSize: 16,
              }}
            />

          </button>

        </div>


        <Deal />

      </section>


      {/* =================================================
          SHOP BY CATEGORY
      ================================================= */}

      <section
        className="
          ab-section
          pt-10
        "
      >

        <div
          className="
            ab-section-title
          "
        >

          <div>

            <h2>
              Shop by category
            </h2>

            <p>
              Find your next favourite
            </p>

          </div>

        </div>


        <ShopeByCategory />

      </section>


      {/* =================================================
          ⭐ LATEST PRODUCTS
          ACTUAL DATABASE PRODUCTS
          INFINITE SCROLL
      ================================================= */}

      <section
        className="
          ab-section
          pt-12
        "
      >

        {/* PRODUCT HEADER */}

        <div
          className="
            mb-6
            flex
            items-end
            justify-between
            gap-4
          "
        >

          <div>

            <p
              className="
                mb-1
                text-xs
                font-bold
                uppercase
                tracking-[.16em]
                text-[#1769ff]
              "
            >
              Amar Bazaar Store
            </p>


            <h2
              className="
                m-0
                text-2xl
                font-extrabold
                tracking-tight
                text-[#172033]
                sm:text-3xl
              "
            >
              Latest Products
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Explore products from our sellers.
            </p>

          </div>


          {/* VIEW ALL */}

          <button
            onClick={() =>
              navigate(
                "/products"
              )
            }
            className="
              hidden
              items-center
              gap-1
              text-sm
              font-bold
              text-[#1769ff]
              transition
              hover:text-blue-800
              sm:flex
            "
          >

            View all

            <ArrowForward
              sx={{
                fontSize: 16,
              }}
            />

          </button>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {productsLoading && (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-20
            "
          >

            <CircularProgress
              size={38}
              thickness={4}
            />

            <p
              className="
                mt-4
                text-sm
                font-medium
                text-gray-500
              "
            >
              Loading products...
            </p>

          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!productsLoading &&
          productError &&
          products.length === 0 && (

            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-red-100
                bg-red-50
                py-12
              "
            >

              <p
                className="
                  m-0
                  text-sm
                  font-semibold
                  text-red-600
                "
              >
                {productError}
              </p>


              <button
                type="button"
                onClick={() =>
                  fetchHomeProducts(
                    0,
                    true
                  )
                }
                className="
                  mt-5
                  rounded-xl
                  bg-[#1769ff]
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-[#0d55d9]
                "
              >
                Try Again
              </button>

            </div>

          )}


        {/* =================================================
            PRODUCTS GRID
        ================================================= */}

        {!productsLoading &&
          products.length > 0 && (

            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
              "
            >

              {products.map(
                (
                  product: ProductData
                ) => (

                  <div
                    key={
                      product.id
                    }
                    className="
                      min-w-0
                    "
                  >

                    <ProductCard
                      product={
                        product
                      }
                    />

                  </div>

                )
              )}

            </div>

          )}


        {/* =================================================
            INFINITE SCROLL
        ================================================= */}

        {!productsLoading &&
          products.length > 0 &&
          productPage + 1 <
            totalProductPages && (

            <div
              ref={
                productsBottomRef
              }
              className="
                flex
                min-h-[140px]
                flex-col
                items-center
                justify-center
              "
            >

              {loadingMoreProducts ? (

                <>

                  <CircularProgress
                    size={30}
                    thickness={4}
                  />

                  <p
                    className="
                      mt-3
                      text-sm
                      font-medium
                      text-gray-500
                    "
                  >
                    Loading more products...
                  </p>

                </>

              ) : (

                <p
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  Scroll to explore more products
                </p>

              )}

            </div>

          )}


        {/* =================================================
            NO PRODUCTS
        ================================================= */}

        {!productsLoading &&
          !productError &&
          products.length === 0 && (

            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                py-20
              "
            >

              <div
                className="
                  mb-4
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  text-2xl
                "
              >
                🛍️
              </div>


              <p
                className="
                  text-lg
                  font-semibold
                  text-gray-600
                "
              >
                No products found.
              </p>


              <p
                className="
                  mt-1
                  text-sm
                  text-gray-400
                "
              >
                Products will appear here when available.
              </p>

            </div>

          )}


        {/* =================================================
            END OF PRODUCTS
        ================================================= */}

        {!productsLoading &&
          !loadingMoreProducts &&
          products.length > 0 &&
          productPage + 1 >=
            totalProductPages && (

            <div
              className="
                flex
                items-center
                justify-center
                py-10
              "
            >

              <div
                className="
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  px-5
                  py-2.5
                  shadow-sm
                "
              >

                <p
                  className="
                    m-0
                    text-xs
                    font-semibold
                    text-gray-500
                  "
                >
                  You have reached the end of the products.
                </p>

              </div>

            </div>

          )}

      </section>


      {/* =================================================
          SELLER CTA
      ================================================= */}

      <section
        className="
          ab-section
          pt-10
        "
      >

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-[#172033]
            px-6
            py-10
            text-white
            sm:px-10
            lg:px-16
          "
        >

          <div
            className="
              absolute
              right-0
              top-0
              h-full
              w-1/3
              bg-gradient-to-l
              from-[#1769ff]/40
              to-transparent
            "
          />


          <div
            className="
              absolute
              -right-20
              -bottom-32
              h-80
              w-80
              rounded-full
              border
              border-white/5
            "
          />


          <div
            className="
              relative
              z-10
              max-w-2xl
            "
          >

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-blue-500/10
                px-3
                py-1
                text-xs
                font-bold
                uppercase
                tracking-[.15em]
                text-blue-300
              "
            >

              <Storefront
                sx={{
                  fontSize: 16,
                }}
              />

              For entrepreneurs

            </div>


            <h2
              className="
                mt-3
                text-2xl
                font-extrabold
                sm:text-4xl
              "
            >
              Turn your products into a growing business.
            </h2>


            <p
              className="
                mt-3
                text-sm
                leading-6
                text-gray-300
              "
            >
              Join Amar Bazaar and reach customers with a simple seller experience.
            </p>


            <Button
              onClick={() =>
                navigate(
                  "/become-seller"
                )
              }
              startIcon={
                <Storefront />
              }
              variant="contained"
              sx={{
                mt: 3,
                textTransform:
                  "none",
                borderRadius:
                  "11px",
                bgcolor:
                  "#ffb400",
                color:
                  "#172033",
                fontWeight: 800,
                boxShadow: "none",
                px: 3,
                py: 1.2,

                "&:hover": {
                  bgcolor:
                    "#ffc533",
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,.15)",
                },
              }}
            >
              Become a Seller
            </Button>

          </div>

        </div>

      </section>


      {/* =================================================
          BOTTOM SHOPPING CTA
      ================================================= */}

      <section
        className="
          ab-section
          pt-10
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            justify-between
            gap-5
            rounded-3xl
            border
            border-blue-100
            bg-gradient-to-r
            from-blue-50
            to-indigo-50
            px-6
            py-7
            text-center
            sm:flex-row
            sm:text-left
            sm:px-10
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                text-blue-600
                sm:justify-start
              "
            >

              <ShoppingBagOutlined />

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                "
              >
                Amar Bazaar
              </span>

            </div>


            <h3
              className="
                mt-1
                text-xl
                font-extrabold
                text-slate-900
              "
            >
              Ready to discover something new?
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Browse our latest products and offers.
            </p>

          </div>


          <Button
            onClick={() =>
              navigate(
                "/products"
              )
            }
            variant="contained"
            endIcon={
              <ArrowForward />
            }
            sx={{
              minWidth: 150,
              borderRadius:
                "11px",
              textTransform:
                "none",
              fontWeight: 800,
              boxShadow: "none",
              background:
                "linear-gradient(90deg,#2563eb,#4f46e5)",

              "&:hover": {
                boxShadow:
                  "0 8px 20px rgba(37,99,235,.2)",
              },
            }}
          >
            Start Shopping
          </Button>

        </div>

      </section>


    </main>
  );
};


export default Home;
