import { PrismaClient } from "@prisma/client";
import { ReviewWithUser } from "../types/reviewTypes";

const prisma = new PrismaClient();

const reviewService = {
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
