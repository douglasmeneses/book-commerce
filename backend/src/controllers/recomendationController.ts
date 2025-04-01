import { Request, Response } from "express";
import recomendationService from "../services/recomendationService";

const recomendationController = {
  async getBookRecommendations(req: Request, res: Response) {
    const user_id = parseInt(req.params.user_id);

    try {
      const books = await recomendationService.getBookRecommendations(user_id);

      return res.status(200).json(books);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error getting book recommendations" });
    }
  },
};

export default recomendationController;
