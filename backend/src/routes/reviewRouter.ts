import { Router } from "express";
import { Request, Response } from "express";
import reviewController from "../controllers/reviewController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Gerenciamento de avaliações de livros
 */

/**
 * @swagger
 * /reviews/{book_uuid}:
 *   post:
 *     summary: Criar uma nova avaliação para um livro
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: book_uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do livro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_uuid:
 *                 type: string
 *               review:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *       400:
 *         description: Erro ao criar a avaliação
 *       404:
 *         description: Livro ou usuário não encontrado
 */
router.post("/:book_uuid", (req: Request, res: Response) => {
  reviewController.createReview(req, res);
});

/**
 * @swagger
 * /reviews/{book_uuid}:
 *   get:
 *     summary: Obter todas as avaliações de um livro
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: book_uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do livro
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de avaliações a serem retornadas
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de avaliações a serem ignoradas
 *       - in: query
 *         name: byRating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filtrar avaliações por nota
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Ordenar avaliações por data de criação
 *     responses:
 *       200:
 *         description: Lista de avaliações retornada com sucesso
 *       404:
 *         description: Livro não encontrado
 */
router.get("/:book_uuid", (req: Request, res: Response) => {
  reviewController.getReviews(req, res);
});

/**
 * @swagger
 * /reviews/{review_uuid}:
 *   put:
 *     summary: Atualizar uma avaliação existente
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: review_uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID da avaliação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
 *       404:
 *         description: Avaliação não encontrada
 *       400:
 *         description: Dados inválidos
 */
router.put("/:review_uuid", (req: Request, res: Response) => {
  reviewController.updateReview(req, res);
});

/**
 * @swagger
 * /reviews/{review_uuid}:
 *   delete:
 *     summary: Excluir uma avaliação
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: review_uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID da avaliação
 *     responses:
 *       200:
 *         description: Avaliação excluída com sucesso
 *       404:
 *         description: Avaliação não encontrada
 */
router.delete("/:review_uuid", (req: Request, res: Response) => {
  reviewController.deleteReview(req, res);
});

export default router;
