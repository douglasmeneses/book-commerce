import favoriteController from "../controllers/favoriteController";
import { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Gerenciamento de livros favoritos
 */

/**
 * @swagger
 * /favorites/book/{book_uuid}:
 *   post:
 *     summary: Adicionar ou remover um livro dos favoritos
 *     tags: [Favorites]
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
 *                 description: UUID do usuário
 *     responses:
 *       200:
 *         description: Livro adicionado ou removido dos favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem indicando se o livro foi favoritado ou desfavoritado
 *       404:
 *         description: Livro ou usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/book/:book_uuid", (req: Request, res: Response) => {
  favoriteController.favoriteBook(req, res);
});

/**
 * @swagger
 * /favorites/user/{user_uuid}:
 *   get:
 *     summary: Obter lista de livros favoritos de um usuário
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do usuário
 *     responses:
 *       200:
 *         description: Lista de livros favoritos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   uuid:
 *                     type: string
 *                     description: UUID do livro
 *                   title:
 *                     type: string
 *                     description: Título do livro
 *                   authors:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: Nome do autor
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: Nome do gênero
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/user/:user_uuid",
  authMiddleware,
  (req: Request, res: Response) => {
    favoriteController.getFavorites(req, res);
  }
);

export default router;
