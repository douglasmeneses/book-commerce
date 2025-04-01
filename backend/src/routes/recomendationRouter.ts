import { Router } from "express";
import recomendationController from "../controllers/recomendationController";
import { Request, Response } from "express";

const router = Router();

router.get("/:user_id", async (req: Request, res: Response) => {
  recomendationController.getBookRecommendations(req, res);
});

export default router;
