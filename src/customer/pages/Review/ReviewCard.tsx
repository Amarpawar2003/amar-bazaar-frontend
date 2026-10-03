import React from "react";
import { Avatar, IconButton, Rating } from "@mui/material";
import { Delete } from "@mui/icons-material";

interface ReviewUser {
  id?: number;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ReviewData {
  id?: number;
  rating?: number;
  reviewText?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: ReviewUser;
  userName?: string;
  image?: string;
}

interface ReviewCardProps {
  review?: ReviewData;
  onDelete?: (reviewId: number) => void;
  canDelete?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onDelete,
  canDelete = false,
}) => {
  if (!review) {
    return null;
  }

  // =========================
  // USER NAME
  // =========================
  const getUserName = (): string => {
    if (review.user?.fullName?.trim()) {
      return review.user.fullName.trim();
    }

    if (review.user?.name?.trim()) {
      return review.user.name.trim();
    }

    const firstName = review.user?.firstName?.trim() || "";
    const lastName = review.user?.lastName?.trim() || "";

    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }

    if (review.userName?.trim()) {
      return review.userName.trim();
    }

    return "Customer";
  };

  const userName = getUserName();

  // =========================
  // AVATAR LETTER
  // =========================
  const avatarLetter =
    userName.charAt(0).toUpperCase() || "C";

  // =========================
  // RATING
  // =========================
  const rating = Math.max(
    0,
    Math.min(5, Number(review.rating ?? 0))
  );

  // =========================
  // REVIEW TEXT
  // =========================
  const comment =
    review.reviewText?.trim() || "No review comment.";

  // =========================
  // DATE
  // =========================
  const formatDate = (date?: string): string => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const reviewDate = formatDate(
    review.createdAt || review.updatedAt
  );

  // =========================
  // DELETE
  // =========================
  const handleDelete = () => {
    if (review.id !== undefined && onDelete) {
      onDelete(review.id);
    }
  };

  return (
    <article className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* HEADER */}
      <div className="flex items-start gap-4">

        {/* AVATAR */}
        <Avatar
          src={review.image || undefined}
          alt={userName}
          sx={{
            width: 52,
            height: 52,
            backgroundColor: "#1769ff",
            fontWeight: 700,
          }}
        >
          {avatarLetter}
        </Avatar>

        {/* REVIEW CONTENT */}
        <div className="min-w-0 flex-1">

          {/* USER */}
          <div className="flex items-start justify-between gap-3">

            <div>
              <h3 className="text-base font-bold text-slate-800">
                {userName}
              </h3>

              {reviewDate && (
                <p className="mt-0.5 text-xs text-slate-400">
                  {reviewDate}
                </p>
              )}
            </div>

            {/* DELETE BUTTON */}
            {canDelete && review.id !== undefined && (
              <IconButton
                size="small"
                onClick={handleDelete}
                aria-label="Delete review"
                sx={{
                  color: "#dc2626",
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </div>

          {/* RATING */}
          <div className="mt-2 flex items-center gap-2">
            <Rating
              value={rating}
              precision={0.5}
              readOnly
              size="small"
            />

            <span className="text-sm font-semibold text-slate-600">
              {rating.toFixed(1)}
            </span>
          </div>

          {/* REVIEW TEXT */}
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {comment}
          </p>

        </div>
      </div>

    </article>
  );
};

export default ReviewCard;