import { Router, Request, Response } from "express";
import recomendationController from "../controllers/recomendationController";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  recomendationController.getRecommendations(req, res);
});

router.post("/:uuid", async (req: Request, res: Response) => {
  recomendationController.registerRecommendation(req, res);
});
export default router;
