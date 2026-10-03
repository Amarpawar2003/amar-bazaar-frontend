import React, { FormEvent, useEffect, useState } from "react";

import {
  Alert,
  CircularProgress,
  IconButton,
  InputBase,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { api } from "../../../config/api";

import ProductCard from "../Product/ProductCard";
import { ProductData } from "../Product/Product";

const Search = () => {
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams();

  const [query, setQuery] = useState(
    params.get("query") || ""
  );

  const [products, setProducts] = useState<ProductData[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /* =========================================================
     SEARCH PRODUCTS
  ========================================================= */

  const searchProducts = async (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setProducts([]);
      setError("");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log(
        "Searching products:",
        trimmed
      );

      const response = await api.get<ProductData[]>(
        "/products/search",
        {
          params: {
            query: trimmed,
          },
        }
      );

      console.log(
        "Search response:",
        response.data
      );

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error(
        "SEARCH PRODUCTS ERROR:",
        err
      );

      console.error(
        "SEARCH RESPONSE:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to search products. Please try again.";

      setError(message);

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     READ QUERY FROM URL
  ========================================================= */

  useEffect(() => {
    const value =
      params.get("query") || "";

    setQuery(value);

    void searchProducts(value);
  }, [params]);

  /* =========================================================
     SUBMIT SEARCH
  ========================================================= */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      setProducts([]);
      setError("");

      setParams({});

      return;
    }

    setParams({
      query: value,
    });
  };

  /* =========================================================
     CLEAR SEARCH
  ========================================================= */

  const handleClearSearch = () => {
    setQuery("");

    setProducts([]);

    setError("");

    setParams({});
  };

  /* =========================================================
     HOME
  ========================================================= */

  const handleHome = () => {
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="bg-white border-b border-slate-200">

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            md:px-8
            lg:px-12
            py-7
          "
        >

          {/* Breadcrumb */}

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
              mb-3
            "
          >

            <button
              type="button"
              onClick={handleHome}
              className="
                hover:text-blue-600
                transition
                font-medium
              "
            >
              Home
            </button>

            <span>/</span>

            <span className="text-slate-700">
              Search
            </span>

          </div>

          {/* Heading */}

          <h1
            className="
              text-3xl
              md:text-4xl
              font-extrabold
              text-slate-900
            "
          >
            Search Products
          </h1>

          <p
            className="
              text-slate-500
              mt-2
              text-sm
              md:text-base
            "
          >
            Find your favorite products on Amar Bazaar
          </p>

        </div>

      </section>

      {/* =====================================================
          SEARCH BAR
      ===================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          md:px-8
          lg:px-12
          pt-7
        "
      >

        <form
          onSubmit={handleSubmit}
          className="
            flex
            items-center
            w-full
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-sm
            overflow-hidden
            transition-all
            focus-within:border-blue-500
            focus-within:ring-4
            focus-within:ring-blue-100
          "
        >

          {/* Search Icon */}

          <SearchIcon
            sx={{
              ml: 2,
              color: "#667085",
              fontSize: 25,
            }}
          />

          {/* Input */}

          <InputBase
            fullWidth
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="
              Search products, brands and categories...
            "
            sx={{
              px: 1.5,
              py: 1.2,
              fontSize: "15px",
            }}
          />

          {/* Clear */}

          {query && (
            <IconButton
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              sx={{
                mr: 0.5,
                color: "#667085",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}

          {/* Search Button */}

          <button
            type="submit"
            className="
              h-[52px]
              px-5
              sm:px-7
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-bold
              transition
              flex
              items-center
              justify-center
              gap-2
              flex-shrink-0
            "
          >

            <SearchIcon fontSize="small" />

            <span className="hidden sm:inline">
              Search
            </span>

          </button>

        </form>

      </section>

      {/* =====================================================
          RESULT HEADER
      ===================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          md:px-8
          lg:px-12
          mt-8
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-end
            sm:justify-between
            gap-3
          "
        >

          <div>

            {query ? (
              <>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-blue-600
                    mb-1
                  "
                >
                  Search Results
                </p>

                <h2
                  className="
                    text-2xl
                    md:text-3xl
                    font-extrabold
                    text-slate-900
                    break-words
                  "
                >
                  Results for "{query}"
                </h2>
              </>
            ) : (
              <h2
                className="
                  text-2xl
                  md:text-3xl
                  font-extrabold
                  text-slate-900
                "
              >
                Search Products
              </h2>
            )}

            {query &&
              !loading &&
              !error && (
                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-2
                  "
                >
                  {products.length}{" "}
                  {products.length === 1
                    ? "product"
                    : "products"}{" "}
                  found
                </p>
              )}

          </div>

        </div>

      </section>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <section
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            md:px-8
            lg:px-12
            mt-6
          "
        >

          <Alert
            severity="error"
            variant="filled"
            sx={{
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>

        </section>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <section
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            md:px-8
            lg:px-12
            py-20
          "
        >

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
            "
          >

            <CircularProgress
              size={40}
              thickness={4}
            />

            <p
              className="
                mt-4
                text-sm
                font-medium
                text-slate-500
              "
            >
              Searching products...
            </p>

          </div>

        </section>
      )}

      {/* =====================================================
          INITIAL EMPTY STATE
      ===================================================== */}

      {!loading &&
        !error &&
        !query && (
          <section
            className="
              max-w-7xl
              mx-auto
              px-4
              sm:px-6
              md:px-8
              lg:px-12
              py-16
              md:py-20
            "
          >

            <div
              className="
                bg-white
                rounded-3xl
                border
                border-slate-200
                p-10
                md:p-16
                text-center
                shadow-sm
              "
            >

              <div
                className="
                  mx-auto
                  w-20
                  h-20
                  rounded-full
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                "
              >

                <ShoppingBagOutlinedIcon
                  sx={{
                    fontSize: 38,
                    color: "#2563eb",
                  }}
                />

              </div>

              <h2
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                  mt-6
                "
              >
                What are you looking for?
              </h2>

              <p
                className="
                  text-slate-500
                  mt-2
                  max-w-md
                  mx-auto
                "
              >
                Search for products, categories or
                brands available on Amar Bazaar.
              </p>

            </div>

          </section>
        )}

      {/* =====================================================
          NO RESULTS
      ===================================================== */}

      {!loading &&
        !error &&
        query &&
        products.length === 0 && (
          <section
            className="
              max-w-7xl
              mx-auto
              px-4
              sm:px-6
              md:px-8
              lg:px-12
              py-14
            "
          >

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-3xl
                p-10
                md:p-16
                text-center
                shadow-sm
              "
            >

              <div
                className="
                  mx-auto
                  w-20
                  h-20
                  rounded-full
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                "
              >

                <SearchIcon
                  sx={{
                    fontSize: 38,
                    color: "#64748b",
                  }}
                />

              </div>

              <h2
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                  mt-6
                "
              >
                No products found
              </h2>

              <p
                className="
                  text-slate-500
                  mt-2
                "
              >
                We couldn't find anything matching{" "}
                <span
                  className="
                    font-semibold
                    text-slate-700
                  "
                >
                  "{query}"
                </span>
              </p>

              <p
                className="
                  text-sm
                  text-slate-400
                  mt-2
                "
              >
                Try another product name, brand or
                category.
              </p>

              <button
                type="button"
                onClick={handleClearSearch}
                className="
                  mt-6
                  px-6
                  py-3
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-bold
                  transition
                "
              >
                Clear Search
              </button>

            </div>

          </section>
        )}

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      {!loading &&
        !error &&
        products.length > 0 && (
          <section
            className="
              max-w-7xl
              mx-auto
              px-4
              sm:px-6
              md:px-8
              lg:px-12
              py-8
              pb-16
            "
          >

            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                gap-4
                md:gap-5
                lg:gap-6
              "
            >

              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>

          </section>
        )}

    </main>
  );
};

export default Search;