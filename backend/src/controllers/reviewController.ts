import reviewService from "../services/reviewService";
import { Request, Response } from "express";

const reviewController = {
  getReviews: async (req: Request, res: Response): Promise<Response> => {
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
};

export default reviewController;
