import { PrismaClient } from "@prisma/client";
import { CreateReview, ReviewWithUser } from "../types/reviewTypes";

const prisma = new PrismaClient();

const reviewService = {
  createReview: async (
    book_uuid: string,
    user_uuid: string,
    review: string,
    rating: number
  ): Promise<CreateReview | { error: number; message: string }> => {
    try {
      if (!book_uuid || !user_uuid || !review || !rating)
        return { message: "All fields are required", error: 400 };

      if (rating < 1 || rating > 5)
        return { message: "Rating must be between 1 and 5", error: 400 };

      if (review.length < 10)
        return { message: "Review must be at least 10 characters", error: 400 };

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

      const allReviews = await prisma.review.findMany({
        where: { book_id: book.id },
      });

      const averageRating =
        allReviews.reduce((acc, review) => acc + Number(review.rating), 0) /
        allReviews.length;

      await prisma.book.update({
        where: { id: book.id },
        data: { rating: averageRating },
      });

      return {
        message: "Review created successfully",
        data: {
          book_id: newReview.book_id,
          user_id: newReview.user_id,
          content: newReview.content,
          rating: Number(newReview.rating),
        },
      };
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "An error occurred",
        error: 500,
      };
    }
  },

  getReviews: async (
    book_uuid: string
  ): Promise<ReviewWithUser[] | { error: number; message: string }> => {
    try {
      const bookExists = await prisma.book.findFirst({
        where: { uuid: book_uuid },
      });

      if (!bookExists) return { message: "Book not found", error: 404 };

      const reviews = await prisma.review.findMany({
        where: { book: { uuid: book_uuid } },
        orderBy: { created_at: "desc" },
        include: {
          user: {
            select: { uuid: true, name: true, username: true, avatar: true },
          },
        },
      });

      if (reviews.length === 0)
        return { message: "No reviews found", error: 404 };

      const formattedReviews: ReviewWithUser[] = reviews.map((review) => ({
        ...review,
        rating: Number(review.rating),
      }));

      return formattedReviews;
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "An error occurred",
        error: 500,
      };
    }
  },
};

export default reviewService;
