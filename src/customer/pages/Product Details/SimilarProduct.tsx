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
  category?: {
    id?: number | string;
    categoryId?: number | string;
    name?: string;
  };
}

interface ProductResponse {
  content?: SimilarProductData[];
  totalElements?: number;
  totalPages?: number;
}

const SimilarProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId?: string }>();

  const [products, setProducts] = useState<SimilarProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await api.get<ProductResponse | SimilarProductData[]>(
          "/products",
          { params: { page: 0, size: 12 } }
        );

        const data = response.data;
        const productList = Array.isArray(data) ? data : data?.content || [];

        if (!active) return;

        setProducts(
          productList
            .filter((item) => String(item.id) !== String(productId))
            .slice(0, 8)
        );
      } catch (err) {
        console.error("SIMILAR PRODUCTS ERROR:", err);
        if (active) {
          setError(true);
          setProducts([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSimilarProducts();
    return () => {
      active = false;
    };
  }, [productId]);

  const openProduct = (product: SimilarProductData) => {
    const categoryId =
      product.category?.categoryId ??
      product.category?.id ??
      "all";
    const slug = encodeURIComponent(
      (product.title || "product").trim().replace(/\s+/g, "-")
    );

    navigate(
      `/product-details/${encodeURIComponent(String(categoryId))}/${slug}/${product.id}`
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <div className="aspect-square animate-pulse bg-slate-200" />
            <div className="space-y-3 p-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-slate-500">No similar products available right now.</p>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="mt-4 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {products.map((product) => (
        <div
          key={product.id}
          role="link"
          tabIndex={0}
          onClick={() => openProduct(product)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openProduct(product);
            }
          }}
          className="cursor-pointer"
          aria-label={`View ${product.title}`}
        >
          <SimilarProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default SimilarProduct;
