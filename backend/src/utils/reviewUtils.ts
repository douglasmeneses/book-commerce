import { Review } from "../types/reviewTypes";

export const averageRating = (reviews: Review[]) => {
  if (reviews.length === 0) return 0;
  return (
    reviews.reduce((acc, review) => acc + Number(review.rating), 0) /
    reviews.length
  );
};

export const validateReviewFields = ({
  review,
  rating,
}: {
  review: string;
  rating: number;
}): { message: string; error: number } | null => {
  if (!review || !rating)
    return { message: "All fields are required", error: 400 };

  if (rating < 1 || rating > 5)
    return { message: "Rating must be between 1 and 5", error: 400 };

  if (review.length < 5)
    return { message: "Review must be at least 5 characters", error: 400 };

  return null;
};
