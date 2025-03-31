import reviewService from "../services/reviewService";
import { Request, Response } from "express";

const reviewController = {
  createReview: async (req: Request, res: Response) => {
    const { book_uuid } = req.params;
    const { user_uuid, review, rating } = req.body;

    try {
      const newReview = await reviewService.createReview(
        book_uuid,
        user_uuid,
        review,
        rating
      );

      if ("error" in newReview)
        return res.status(newReview.error).json({ message: newReview.message });

      return res.status(201).json(newReview);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  },

  getReviews: async (req: Request, res: Response): Promise<Response> => {
    const { book_uuid } = req.params;

    const filter = {
      limit: req.query.limit ? Number(req.query.limit) : 10,
      offset: req.query.offset ? Number(req.query.offset) : 0,
      byRating: req.query.byRating ? Number(req.query.byRating) : undefined,
      orderBy: ["asc", "desc"].includes(req.query.orderBy as string)
        ? (req.query.orderBy as "asc" | "desc")
        : "desc",
    };

    try {
      const reviews = await reviewService.getReviews(book_uuid, filter);

      if ("error" in reviews) {
        return res.status(reviews.error).json({ message: reviews.message });
      }

      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  },

  updateReview: async (req: Request, res: Response) => {
    const { review_uuid } = req.params;
    const { review, rating } = req.body;

    try {
      const updatedReview = await reviewService.updateReview(
        review_uuid,
        review,
        rating
      );

      if ("error" in updatedReview) {
        return res.status(updatedReview.error).json({
          message: updatedReview.message,
        });
      }

      return res.status(200).json(updatedReview);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  },

  deleteReview: async (req: Request, res: Response) => {
    const { review_uuid } = req.params;

    try {
      const deletedReview = await reviewService.deleteReview(review_uuid);

      if ("error" in deletedReview) {
        return res.status(deletedReview.error).json({
          message: deletedReview.message,
        });
      }

      return res.status(200).json(deletedReview);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  },
};

export default reviewController;
