import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import {
  Alert,
  Button,
  Divider,
  LinearProgress,
  Rating,
  Snackbar,
  TextField,
} from "@mui/material";

import { api } from "../../../config/api";

interface ProductData {
  id: number;
  title: string;
  description?: string;
  mrPrice?: number;
  sellingPrice?: number;
  discountPercent?: number;
  quantity?: number;
  color?: string;
  images?: string[];
}

interface ReviewUser {
  id?: number;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface ApiReview {
  id?: number;
  reviewText?: string;
  rating?: number;
  productImages?: string[];
  createdAt?: string;
  updatedAt?: string;
  user?: ReviewUser;
}

interface ReviewData {
  id?: number;
  rating?: number;
  reviewText?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: ReviewUser;
  userName?: string;
}

const Review: React.FC = () => {
  // =========================================================
  // PRODUCT ID
  // =========================================================

  const { productId } = useParams<{
    categoryId?: string;
    name?: string;
    productId?: string;
  }>();

  const numericProductId = useMemo(() => {
    if (!productId) {
      return null;
    }

    const id = Number(productId);

    if (!Number.isFinite(id) || id <= 0) {
      return null;
    }

    return id;
  }, [productId]);

  // =========================================================
  // STATE
  // =========================================================

  const [product, setProduct] =
    useState<ProductData | null>(null);

  const [reviews, setReviews] =
    useState<ReviewData[]>([]);

  const [reviewText, setReviewText] =
    useState("");

  const [selectedRating, setSelectedRating] =
    useState<number | null>(0);

  const [loadingProduct, setLoadingProduct] =
    useState(true);

  const [loadingReviews, setLoadingReviews] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [snackbarOpen, setSnackbarOpen] =
    useState(false);

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  const fetchProduct = useCallback(async () => {
    if (!numericProductId) {
      setLoadingProduct(false);
      return;
    }

    try {
      setLoadingProduct(true);

      const response =
        await api.get<ProductData>(
          `/products/${numericProductId}`
        );

      console.log(
        "REVIEW PRODUCT RESPONSE:",
        response.data
      );

      setProduct(response.data);
    } catch (err: any) {
      console.error(
        "PRODUCT FETCH ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load product."
      );

      setSnackbarOpen(true);
    } finally {
      setLoadingProduct(false);
    }
  }, [numericProductId]);

  // =========================================================
  // FETCH REVIEWS
  // =========================================================

  const fetchReviews = useCallback(async () => {
    if (!numericProductId) {
      setLoadingReviews(false);
      return;
    }

    try {
      setLoadingReviews(true);

      const response =
        await api.get(
          `/api/products/${numericProductId}/review`
        );

      console.log(
        "REVIEW PRODUCT ID:",
        numericProductId
      );

      console.log(
        "REVIEW API RESPONSE:",
        response.data
      );

      // =====================================================
      // NORMALIZE API RESPONSE
      // =====================================================

      let apiReviews: any[] = [];

      if (
        Array.isArray(response.data)
      ) {
        apiReviews = response.data;
      } else if (
        response.data &&
        Array.isArray(
          response.data.content
        )
      ) {
        apiReviews =
          response.data.content;
      } else if (
        response.data &&
        Array.isArray(
          response.data.reviews
        )
      ) {
        apiReviews =
          response.data.reviews;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        response.data.id !== undefined
      ) {
        apiReviews = [
          response.data,
        ];
      }

      console.log(
        "API REVIEWS ARRAY:",
        apiReviews
      );

      console.log(
        "API REVIEWS LENGTH:",
        apiReviews.length
      );

      // =====================================================
      // FORMAT REVIEWS
      // =====================================================

      const formattedReviews: ReviewData[] =
        apiReviews
          .filter(
            (review: any) =>
              review &&
              typeof review === "object"
          )
          .map(
            (review: ApiReview) => ({
              id: review.id,

              rating: Number(
                review.rating ?? 0
              ),

              reviewText:
                review.reviewText ?? "",

              createdAt:
                review.createdAt,

              updatedAt:
                review.updatedAt,

              user: review.user
                ? {
                    id:
                      review.user.id,

                    name:
                      review.user.name,

                    fullName:
                      review.user.fullName,

                    firstName:
                      review.user.firstName,

                    lastName:
                      review.user.lastName,

                    email:
                      review.user.email,
                  }
                : undefined,
            })
          );

      console.log(
        "FORMATTED REVIEWS:",
        formattedReviews
      );

      console.log(
        "FORMATTED REVIEWS LENGTH:",
        formattedReviews.length
      );

      setReviews(
        formattedReviews
      );
    } catch (err: any) {
      console.error(
        "REVIEWS FETCH ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load reviews."
      );

      setSnackbarOpen(true);
    } finally {
      setLoadingReviews(false);
    }
  }, [numericProductId]);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [
    fetchProduct,
    fetchReviews,
  ]);

  // =========================================================
  // RATING SUMMARY
  // =========================================================

  const totalRatings =
    reviews.length;

  const averageRating =
    useMemo(() => {
      if (reviews.length === 0) {
        return 0;
      }

      const total =
        reviews.reduce(
          (
            sum,
            review
          ) =>
            sum +
            Number(
              review.rating ?? 0
            ),
          0
        );

      return (
        total /
        reviews.length
      );
    }, [reviews]);

  // =========================================================
  // RATING DISTRIBUTION
  // =========================================================

  const ratingDistribution =
    useMemo(() => {
      const distribution: Record<
        number,
        number
      > = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      reviews.forEach(
        (review) => {
          const rating =
            Math.round(
              Number(
                review.rating ?? 0
              )
            );

          if (
            rating >= 1 &&
            rating <= 5
          ) {
            distribution[
              rating
            ]++;
          }
        }
      );

      return distribution;
    }, [reviews]);

  // =========================================================
  // SUBMIT REVIEW
  // =========================================================

  const handleSubmitReview =
    async () => {
      if (!numericProductId) {
        setError(
          "Invalid product ID."
        );

        setSnackbarOpen(true);

        return;
      }

      const jwt =
        localStorage.getItem(
          "jwt"
        );

      if (!jwt) {
        setError(
          "Please login before submitting a review."
        );

        setSnackbarOpen(true);

        return;
      }

      if (
        !selectedRating ||
        selectedRating < 1
      ) {
        setError(
          "Please select a rating."
        );

        setSnackbarOpen(true);

        return;
      }

      if (!reviewText.trim()) {
        setError(
          "Please write a review."
        );

        setSnackbarOpen(true);

        return;
      }

      try {
        setSubmitting(true);

        const requestBody = {
          reviewText:
            reviewText.trim(),

          reviewRating:
            selectedRating,

          productImages: [],
        };

        console.log(
          "CREATE REVIEW REQUEST:",
          requestBody
        );

        const response =
          await api.post(
            `/api/products/${numericProductId}/review`,
            requestBody,
            {
              headers: {
                Authorization:
                  `Bearer ${jwt}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        console.log(
          "CREATE REVIEW RESPONSE:",
          response.data
        );

        setReviewText("");

        setSelectedRating(0);

        setError("");

        setSuccessMessage(
          "Review submitted successfully."
        );

        setSnackbarOpen(true);

        await fetchReviews();
      } catch (err: any) {
        console.error(
          "CREATE REVIEW ERROR:",
          err
        );

        console.error(
          "CREATE REVIEW RESPONSE:",
          err?.response?.data
        );

        setError(
          err?.response?.data?.message ||
            "Unable to submit review."
        );

        setSnackbarOpen(true);
      } finally {
        setSubmitting(false);
      }
    };

  // =========================================================
  // DELETE REVIEW
  // =========================================================

  const handleDeleteReview =
    async (
      reviewId: number
    ) => {
      const jwt =
        localStorage.getItem(
          "jwt"
        );

      if (!jwt) {
        setError(
          "Please login first."
        );

        setSnackbarOpen(true);

        return;
      }

      try {
        await api.delete(
          `/api/reviews/${reviewId}`,
          {
            headers: {
              Authorization:
                `Bearer ${jwt}`,
            },
          }
        );

        setError("");

        setSuccessMessage(
          "Review deleted successfully."
        );

        setSnackbarOpen(true);

        await fetchReviews();
      } catch (err: any) {
        console.error(
          "DELETE REVIEW ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to delete review."
        );

        setSnackbarOpen(true);
      }
    };

  // =========================================================
  // CLOSE SNACKBAR
  // =========================================================

  const handleCloseSnackbar =
    () => {
      setSnackbarOpen(false);
      setError("");
      setSuccessMessage("");
    };

  // =========================================================
  // INVALID PRODUCT
  // =========================================================

  if (!numericProductId) {
    return (
      <Alert severity="error">
        Invalid product ID.
      </Alert>
    );
  }

  // =========================================================
  // PRODUCT LOADING
  // =========================================================

  if (loadingProduct) {
    return (
      <div className="w-full py-6">
        <LinearProgress />
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <section className="w-full">

      {/* PRODUCT */}

      {product && (
        <div className="mb-6">

          <h3 className="text-xl font-bold text-slate-800">
            Customer Reviews
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Reviews for{" "}
            {product.title}
          </p>

        </div>
      )}

      {/* RATING SUMMARY */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* AVERAGE RATING */}

          <div className="flex flex-col items-center justify-center border-b border-slate-200 pb-5 md:border-b-0 md:border-r md:pb-0">

            <div className="text-4xl font-extrabold text-slate-800">
              {averageRating > 0
                ? averageRating.toFixed(
                    1
                  )
                : "0.0"}
            </div>

            <Rating
              value={
                averageRating
              }
              precision={0.1}
              readOnly
              size="medium"
            />

            <p className="mt-2 text-sm text-slate-500">
              {totalRatings}{" "}
              {totalRatings === 1
                ? "Rating"
                : "Ratings"}
            </p>

          </div>

          {/* RATING BARS */}

          <div className="md:col-span-2">

            {[5, 4, 3, 2, 1].map(
              (star) => {
                const count =
                  ratingDistribution[
                    star
                  ];

                const percentage =
                  totalRatings > 0
                    ? (count /
                        totalRatings) *
                      100
                    : 0;

                return (
                  <div
                    key={star}
                    className="mb-3 flex items-center gap-3"
                  >

                    <span className="w-10 text-sm font-semibold text-slate-600">
                      {star} ★
                    </span>

                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-yellow-400 transition-all"
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />

                    </div>

                    <span className="w-8 text-right text-xs text-slate-500">
                      {count}
                    </span>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>

      {/* WRITE REVIEW */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

        <h3 className="text-lg font-bold text-slate-800">
          Write a Review
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Share your experience with this product.
        </p>

        <div className="mt-5">

          <p className="mb-2 text-sm font-semibold text-slate-700">
            Your Rating
          </p>

          <Rating
            value={
              selectedRating
            }
            onChange={(
              _,
              value
            ) => {
              setSelectedRating(
                value
              );
            }}
            size="large"
          />

        </div>

        <TextField
          fullWidth
          multiline
          minRows={4}
          value={reviewText}
          onChange={(
            event
          ) => {
            setReviewText(
              event.target.value
            );
          }}
          placeholder="Write your review..."
          sx={{
            marginTop: 3,
          }}
        />

        <div className="mt-4 flex justify-end">

          <Button
            variant="contained"
            onClick={
              handleSubmitReview
            }
            disabled={
              submitting ||
              !selectedRating ||
              !reviewText.trim()
            }
            sx={{
              minHeight: 44,
              paddingX: 4,
              borderRadius:
                "10px",
              textTransform:
                "none",
              fontWeight: 700,
            }}
          >
            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </Button>

        </div>

      </div>

      {/* ALL REVIEWS */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

        <div className="mb-5">

          <h3 className="text-lg font-bold text-slate-800">
            All Reviews
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {totalRatings}{" "}
            {totalRatings === 1
              ? "review"
              : "reviews"}
          </p>

        </div>

        <Divider />

        {loadingReviews ? (
          <div className="py-8">
            <LinearProgress />
          </div>
        ) : reviews.length === 0 ? (

          <div className="py-10 text-center">

            <p className="text-base font-semibold text-slate-700">
              No reviews yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Be the first customer to review this product.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-200">

            {reviews.map(
              (
                review,
                index
              ) => {

                const userName =
                  review.user
                    ?.fullName ||
                  review.user
                    ?.name ||
                  `${review.user?.firstName || ""} ${
                    review.user?.lastName || ""
                  }`.trim() ||
                  review.userName ||
                  "Customer";

                const rating =
                  Math.max(
                    0,
                    Math.min(
                      5,
                      Number(
                        review.rating ??
                          0
                      )
                    )
                  );

                return (
                  <div
                    key={
                      review.id ??
                      `review-${index}`
                    }
                    className="py-5 first:pt-0 last:pb-0"
                  >

                    <article className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                      <div className="flex items-start gap-4">

                        {/* AVATAR */}

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                          {userName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">

                          <h3 className="text-base font-bold text-slate-800">
                            {userName}
                          </h3>

                          {review.createdAt && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {new Date(
                                review.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month:
                                    "short",
                                  year:
                                    "numeric",
                                }
                              )}
                            </p>
                          )}

                          <div className="mt-2 flex items-center gap-2">

                            <Rating
                              value={
                                rating
                              }
                              precision={
                                0.5
                              }
                              readOnly
                              size="small"
                            />

                            <span className="text-sm font-semibold text-slate-600">
                              {rating.toFixed(
                                1
                              )}
                            </span>

                          </div>

                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {review.reviewText ||
                              "No review comment."}
                          </p>

                          {review.id !==
                            undefined && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteReview(
                                  review.id!
                                )
                              }
                              className="mt-3 text-xs font-semibold text-red-600 hover:text-red-700"
                            >
                              Delete Review
                            </button>
                          )}

                        </div>

                      </div>

                    </article>

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

      {/* SNACKBAR */}

      <Snackbar
        open={
          snackbarOpen
        }
        autoHideDuration={
          3500
        }
        onClose={
          handleCloseSnackbar
        }
        anchorOrigin={{
          vertical:
            "bottom",
          horizontal:
            "center",
        }}
      >

        <Alert
          severity={
            error
              ? "error"
              : "success"
          }
          variant="filled"
          onClose={
            handleCloseSnackbar
          }
        >
          {error ||
            successMessage}
        </Alert>

      </Snackbar>

    </section>
  );
};

export default Review;