import { Router } from "express";
import { Request, Response } from "express";
import reviewController from "../controllers/reviewController";

const router = Router();

router.post("/:book_uuid", (req: Request, res: Response) => {
  reviewController.createReview(req, res);
});

router.get("/:book_uuid", (req: Request, res: Response) => {
  reviewController.getReviews(req, res);
});

export default router;
