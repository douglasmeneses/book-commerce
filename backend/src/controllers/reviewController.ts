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

  getReviews: async (req: Request, res: Response) => {
    const { book_uuid } = req.params;
    try {
      const reviews = await reviewService.getReviews(book_uuid);

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
