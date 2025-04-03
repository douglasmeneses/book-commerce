import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import recomendationService from "../services/recomendationService";

const prisma = new PrismaClient();

const RecommendationController = {

  async getRecommendations(req: Request, res: Response) {
    try {
      const { uuid } = req.params;

      const user = await prisma.user.findUnique({
        where: { uuid },
        select: { id: true },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const books = await recomendationService.getBookRecommendations(user.id);

      if ("error" in books) {
        return res.status(400).json(books);
      }

      return res.json(books);
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  async registerRecommendation(req: Request, res: Response) {
    try {
      const { uuid, book_id } = req.body;

      if (!uuid || !book_id) {
        return res.status(400).json({ error: "UUID do usuário e ID do livro são obrigatórios." });
      }

      const user = await prisma.user.findUnique({
        where: { uuid },
        select: { id: true },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const recommendation = await recomendationService.registerBook(book_id, user.id);

      return res.status(201).json(recommendation);
    } catch (error) {
      console.error("Erro ao armazenar recomendação:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};

export default RecommendationController;
