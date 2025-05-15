import { PrismaClient } from "@prisma/client";
import { CreateReview, ReviewWithUser } from "../types/reviewTypes";
import { averageRating, validateReviewFields } from "../utils/reviewUtils";

const prisma = new PrismaClient();

const reviewService = {
  createReview: async (
    book_uuid: string,
    user_uuid: string,
    review: string,
    rating: number
  ): Promise<CreateReview | { error: number; message: string }> => {
    const validationError = validateReviewFields({ review, rating });
    if (validationError) return validationError;

    try {
      const book = await prisma.book.findFirst({
        where: { uuid: book_uuid },
      });

      if (!book) return { message: "Book not found", error: 404 };

      const user = await prisma.user.findFirst({
        where: { uuid: user_uuid },
      });

      if (!user) return { message: "User not found", error: 404 };

      const existingReview = await prisma.review.findFirst({
        where: { book_id: book.id, user_id: user.id },
      });

      if (existingReview)
        return { message: "You have already reviewed this book", error: 400 };

      const newReview = await prisma.review.create({
        data: {
          user_id: user.id,
          book_id: book.id,
          content: review,
          rating: rating,
        },
      });

      await updateBookRating(book.id);

      return {
        message: "Review created successfully",
        data: { ...newReview, rating: Number(newReview.rating) },
      };
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "An error occurred",
        error: 500,
      };
    }
  },

  getReviews: async (
    book_uuid: string,
    filter: {
      limit: number;
      offset: number;
      byRating?: number;
      orderBy: "asc" | "desc";
    }
  ): Promise<ReviewWithUser[] | { error: number; message: string }> => {
    try {
      const bookExists = await prisma.book.findFirst({
        where: { uuid: book_uuid },
      });

      if (!bookExists) return { message: "Book not found", error: 404 };

      const reviews = await prisma.review.findMany({
        where: {
          book: { uuid: book_uuid },
          ...(filter.byRating !== undefined && { rating: filter.byRating }),
        },
        orderBy: { created_at: filter.orderBy },
        skip: filter.offset,
        take: filter.limit,
        include: {
          user: {
            select: {
              id: true,
              uuid: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      if (reviews.length === 0) return [];

      return reviews;
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "An error occurred",
        error: 500,
      };
    }
  },

  updateReview: async (
    review_uuid: string,
    review: string,
    rating: number
  ): Promise<{ message: string } | { message: string; error: number }> => {
    try {
      const validationError = validateReviewFields({ review, rating });
      if (validationError) return validationError;

      const currentReview = await prisma.review.findFirst({
        where: { uuid: review_uuid },
      });

      if (!currentReview) return { message: "Review not found", error: 404 };

      await prisma.review.update({
        where: { uuid: review_uuid },
        data: { content: review, rating: rating },
      });

      await updateBookRating(currentReview.book_id);

      return { message: "Review updated successfully" };
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "An error occurred",
        error: 500,
      };
    }
  },

  deleteReview: async (
    review_uuid: string
  ): Promise<{ message: string } | { message: string; error: number }> => {
    try {
      const review = await prisma.review.findFirst({
        where: { uuid: review_uuid },
      });

      if (!review) return { message: "Review not found", error: 404 };

      await prisma.review.delete({ where: { uuid: review_uuid } });

      await updateBookRating(review.book_id);

      return { message: "Review deleted successfully" };
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "An error occurred",
        error: 500,
      };
    }
  },
};

export const updateBookRating = async (book_id: number) => {
  const allReviews = await prisma.review.findMany({ where: { book_id } });
  const newRating = averageRating(allReviews);
  await prisma.book.update({
    where: { id: book_id },
    data: { rating: newRating },
  });
};

export default reviewService;
