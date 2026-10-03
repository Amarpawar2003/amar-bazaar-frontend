import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { api } from "../../../config/api";
import SimilarProductCard from "./SimilarProductCard";

interface SimilarProductData {
  id: number;
  title: string;
  description?: string;
  mrPrice: number;
  sellingPrice: number;
  discountPercent: number;
  quantity: number;
  images?: string[];
  color?: string;
  numRatings?: number;
}

interface ProductResponse {
  content?: SimilarProductData[];
  totalElements?: number;
  totalPages?: number;
}

const SimilarProduct = () => {
  const navigate = useNavigate();

  const { productId } = useParams<{
    productId?: string;
  }>();

  const [products, setProducts] = useState<
    SimilarProductData[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    const fetchSimilarProducts =
      async () => {
        try {
          setLoading(true);
          setError(false);

          const response =
            await api.get<ProductResponse>(
              "/products",
              {
                params: {
                  page: 0,
                  size: 8,
                },
              }
            );

          const data = response.data;

          const productList =
            Array.isArray(data)
              ? data
              : data?.content || [];

          /*
           * Current product remove from
           * similar products.
           */
          const filteredProducts =
            productList.filter(
              (item) =>
                String(item.id) !==
                String(productId)
            );

          setProducts(
            filteredProducts.slice(0, 8)
          );
        } catch (err) {
          console.error(
            "SIMILAR PRODUCTS ERROR:",
            err
          );

          setError(true);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };

    fetchSimilarProducts();
  }, [productId]);

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div
        className="
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
        "
      >
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-100
                bg-white
              "
            >
              <div
                className="
                  aspect-square
                  animate-pulse
                  bg-slate-200
                "
              />

              <div className="space-y-3 p-3">

                <div
                  className="
                    h-4
                    w-3/4
                    animate-pulse
                    rounded
                    bg-slate-200
                  "
                />

                <div
                  className="
                    h-4
                    w-1/2
                    animate-pulse
                    rounded
                    bg-slate-200
                  "
                />

                <div
                  className="
                    h-5
                    w-2/3
                    animate-pulse
                    rounded
                    bg-slate-200
                  "
                />

              </div>
            </div>
          )
        )}
      </div>
    );
  }

  /*
   * =========================================================
   * ERROR / EMPTY
   * =========================================================
   */

  if (error || products.length === 0) {
    return (
      <div className="py-10 text-center">

        <p className="text-sm text-slate-500">
          No similar products available
          right now.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/products")
          }
          className="
            mt-4
            rounded-xl
            border
            border-slate-200
            px-5
            py-2.5
            text-sm
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-50
          "
        >
          Browse Products
        </button>

      </div>
    );
  }

  /*
   * =========================================================
   * PRODUCTS
   * =========================================================
   */

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-x-3
        gap-y-6
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        xl:grid-cols-6
      "
    >
      {products.map((product) => (
        <SimilarProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
};

export default SimilarProduct;