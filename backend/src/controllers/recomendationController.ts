import { Request, Response } from "express";
import recomendationService from "../services/recomendationService";

const RecommendationController = {
  getRecommendations: async (req: Request, res: Response) => {
    try {
      const uuid = req.params.uuid as string;

      const books = await recomendationService.getBookRecommendations(uuid);

      if ("error" in books) {
        return res.status(400).json(books);
      }

      return res.json(books);
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};

export default RecommendationController;
