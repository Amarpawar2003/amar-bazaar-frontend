import {
  IconButton,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
} from "@mui/material";

import { FilterAlt } from "@mui/icons-material";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import FilterSection from "./FilterSection";
import ProductCard from "./ProductCard";

import { api } from "../../../config/api";

// =====================================================
// PRODUCT DATA
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
// API RESPONSE
// =====================================================

interface ProductResponse {
  content?: ProductData[];
  totalPages?: number;
  totalElements?: number;
  number?: number;
}

// =====================================================
// PRODUCT PAGE
// =====================================================

const Product = () => {
  const theme = useTheme();

  const isLarge = useMediaQuery(
    theme.breakpoints.up("lg")
  );

  const { category } = useParams<{
    category?: string;
  }>();

  // ===================================================
  // CATEGORY PARAMETER
  // ===================================================

  const categoryParam =
    category === "home_furniture"
      ? "Home"
      : category;

  // ===================================================
  // STATES
  // ===================================================

  const [sort, setSort] = useState("");

  const [products, setProducts] =
    useState<ProductData[]>([]);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [initialLoading, setInitialLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [error, setError] =
    useState("");

  // ===================================================
  // INFINITE SCROLL
  // ===================================================

  const loadingRef = useRef(false);

  const observerRef =
    useRef<IntersectionObserver | null>(null);

  // ===================================================
  // FETCH PRODUCTS
  // ===================================================

  const fetchProducts = useCallback(
    async (
      pageNumber: number,
      reset: boolean = false
    ) => {
      try {
        if (reset) {
          setInitialLoading(true);
        } else {
          setLoadingMore(true);
        }

        setError("");

        const params: Record<string, string | number> = {
          pageNumber,
        };

        if (sort) {
          params.sort = sort;
        }

        // =================================================
        // CATEGORY FILTER
        // =================================================

        if (categoryParam) {
          params.category = categoryParam;
        }

        console.log(
          "PRODUCT REQUEST PARAMS:",
          params
        );

        const response =
          await api.get<ProductResponse>(
            "/products",
            {
              params,
            }
          );

        // =================================================
        // IMPORTANT RESPONSE DEBUG
        // =================================================

        console.log(
          "PRODUCT API RESPONSE:",
          response
        );

        console.log(
          "PRODUCT API DATA:",
          response.data
        );

        console.log(
          "PRODUCT CONTENT:",
          response.data?.content
        );

        console.log(
          "PRODUCT COUNT:",
          response.data?.content?.length
        );

        // =================================================
        // SAFE PRODUCT LIST
        // =================================================

        const productList: ProductData[] =
          Array.isArray(response.data?.content)
            ? response.data.content
            : [];

        console.log(
          "FINAL PRODUCTS:",
          productList
        );

        // =================================================
        // SET PRODUCTS
        // =================================================

        if (reset) {
          setProducts(productList);
        } else {
          setProducts((previous) => {
            const existingIds = new Set(
              previous.map(
                (product) => product.id
              )
            );

            const newProducts =
              productList.filter(
                (product) =>
                  !existingIds.has(
                    product.id
                  )
              );

            return [
              ...previous,
              ...newProducts,
            ];
          });
        }

        // =================================================
        // PAGINATION
        // =================================================

        setTotalPages(
          response.data?.totalPages || 1
        );

        setPage(pageNumber);

      } catch (err: any) {
        console.error(
          "ERROR FETCHING PRODUCTS:",
          err
        );

        console.error(
          "PRODUCT ERROR STATUS:",
          err?.response?.status
        );

        console.error(
          "PRODUCT ERROR DATA:",
          err?.response?.data
        );

        setError(
          err?.response?.data?.message ||
          "Unable to load products. Please try again."
        );
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
        loadingRef.current = false;
      }
    },
    [sort, categoryParam]
  );

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setTotalPages(1);
    setError("");

    loadingRef.current = false;

    fetchProducts(0, true);

  }, [
    categoryParam,
    sort,
    fetchProducts,
  ]);

  // ===================================================
  // SORT
  // ===================================================

  const handleSortChange = (
    event: any
  ) => {
    setSort(event.target.value);
  };

  // ===================================================
  // LOAD MORE
  // ===================================================

  const loadMoreProducts = useCallback(() => {
    if (loadingRef.current) {
      return;
    }

    if (page + 1 >= totalPages) {
      return;
    }

    loadingRef.current = true;

    fetchProducts(
      page + 1,
      false
    );

  }, [
    page,
    totalPages,
    fetchProducts,
  ]);

  // ===================================================
  // INTERSECTION OBSERVER
  // ===================================================

  const lastProductRef =
    useCallback(
      (node: HTMLDivElement | null) => {
        if (loadingRef.current) {
          return;
        }

        if (observerRef.current) {
          observerRef.current.disconnect();
        }

        observerRef.current =
          new IntersectionObserver(
            (entries) => {
              if (
                entries[0]?.isIntersecting
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
      [loadMoreProducts]
    );

  // ===================================================
  // CLEANUP
  // ===================================================

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // ===================================================
  // PAGE TITLE
  // ===================================================

  const pageTitle =
    category === "home_furniture"
      ? "Home & Furniture"
      : category || "All Products";

  // ===================================================
  // UI
  // ===================================================

  return (
    <main className="ab-page py-6 sm:py-8">
      <div className="ab-section">

        {/* HEADER */}

        <div className="mb-6 flex items-end justify-between gap-4">

          <div>

            <p className="mb-1 text-xs font-bold uppercase tracking-[.16em] text-[#1769ff]">
              Amar Bazaar Store
            </p>

            <h1 className="m-0 text-2xl font-extrabold tracking-tight text-[#172033] sm:text-3xl">
              {pageTitle}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Discover products from trusted sellers.
            </p>

          </div>

        </div>

        {/* MAIN GRID */}

        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">

          {/* FILTER */}

          <section className="hidden lg:block">
            <FilterSection />
          </section>

          {/* PRODUCTS */}

          <div className="min-w-0">

            {/* SORT BAR */}

            <div className="mb-5 flex items-center justify-end gap-3 rounded-2xl border border-[#e7eaf0] bg-white p-3 shadow-sm">

              {!isLarge && (
                <IconButton>
                  <FilterAlt />
                </IconButton>
              )}

              <FormControl
                sx={{
                  minWidth: {
                    xs: 150,
                    sm: 190,
                  },
                }}
                size="small"
              >

                <InputLabel>
                  Sort
                </InputLabel>

                <Select
                  value={sort}
                  label="Sort"
                  onChange={
                    handleSortChange
                  }
                >

                  <MenuItem value="">
                    Default
                  </MenuItem>

                  <MenuItem value="price_low">
                    Price Low to High
                  </MenuItem>

                  <MenuItem value="price_high">
                    Price High to Low
                  </MenuItem>

                  <MenuItem value="newest">
                    Newest
                  </MenuItem>

                  <MenuItem value="oldest">
                    Oldest
                  </MenuItem>

                </Select>

              </FormControl>

            </div>

            <Divider />

            {/* INITIAL LOADING */}

            {initialLoading && (
              <div className="flex flex-col items-center justify-center py-24">

                <CircularProgress
                  size={38}
                  thickness={4}
                />

                <p className="mt-4 text-sm font-medium text-gray-500">
                  Loading products...
                </p>

              </div>
            )}

            {/* ERROR */}

            {!initialLoading &&
              error &&
              products.length === 0 && (

                <div className="flex flex-col items-center justify-center py-24">

                  <div className="rounded-full bg-red-50 px-5 py-3">

                    <p className="m-0 text-sm font-semibold text-red-600">
                      {error}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      fetchProducts(
                        0,
                        true
                      )
                    }
                    className="mt-5 rounded-xl bg-[#1769ff] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d55d9]"
                  >
                    Try Again
                  </button>

                </div>
              )}

            {/* PRODUCT GRID */}

            {!initialLoading &&
              products.length > 0 && (

                <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">

                  {products.map(
                    (
                      product,
                      index
                    ) => {

                      const isLast =
                        index ===
                        products.length - 1;

                      return (
                        <div
                          key={
                            product.id
                          }
                          ref={
                            isLast
                              ? lastProductRef
                              : undefined
                          }
                          className="min-w-0"
                        >

                          <ProductCard
                            product={
                              product
                            }
                          />

                        </div>
                      );

                    }
                  )}

                </section>
              )}

            {/* NO PRODUCTS */}

            {!initialLoading &&
              !error &&
              products.length === 0 && (

                <div className="flex flex-col items-center justify-center py-24">

                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    🛍️
                  </div>

                  <p className="text-lg font-semibold text-gray-600">
                    No products found.
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Try another category or filter.
                  </p>

                </div>
              )}

            {/* LOADING MORE */}

            {!initialLoading &&
              loadingMore && (

                <div className="flex flex-col items-center justify-center py-10">

                  <CircularProgress
                    size={30}
                    thickness={4}
                  />

                  <p className="mt-3 text-sm font-medium text-gray-500">
                    Loading more products...
                  </p>

                </div>
              )}

            {/* END */}

            {!initialLoading &&
              !loadingMore &&
              products.length > 0 &&
              page + 1 >= totalPages && (

                <div className="flex items-center justify-center py-12">

                  <div className="rounded-full border border-gray-200 bg-white px-5 py-2.5 shadow-sm">

                    <p className="m-0 text-xs font-semibold text-gray-500">
                      You have reached the end of the products.
                    </p>

                  </div>

                </div>
              )}

          </div>
        </div>
      </div>
    </main>
  );
};

export default Product;