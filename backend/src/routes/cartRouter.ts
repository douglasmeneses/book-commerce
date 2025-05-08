import { Request, Response } from "express";
import cartController from "../controllers/cartController";
import { authMiddleware } from "../middlewares/auth";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Gerenciamento do carrinho de compras
 */

/**
 * @swagger
 * /carts/user/{user_uuid}/item/{book_uuid}:
 *   post:
 *     summary: Adicionar um livro ao carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do usuário
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
 *               quantity:
 *                 type: integer
 *                 description: Quantidade do livro a ser adicionada
 *     responses:
 *       200:
 *         description: Livro adicionado ao carrinho com sucesso
 *       400:
 *         description: Erro ao adicionar o livro ao carrinho
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  "/user/:user_uuid/item/:book_uuid",
  authMiddleware,
  (req: Request, res: Response) => {
    cartController.addBookToCart(req, res);
  }
);

/**
 * @swagger
 * /carts/user/{user_uuid}/item/{cartItem_id}/remove:
 *   put:
 *     summary: Remover uma quantidade de um item do carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do usuário
 *       - in: path
 *         name: cartItem_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item no carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Quantidade a ser removida
 *     responses:
 *       200:
 *         description: Quantidade removida com sucesso
 *       400:
 *         description: Erro ao remover a quantidade do item
 *       500:
 *         description: Erro interno do servidor
 */
router.put(
  "/user/:user_uuid/item/:cartItem_id/remove",
  authMiddleware,
  (req: Request, res: Response) => {
    cartController.removeBookToCart(req, res);
  }
);

/**
 * @swagger
 * /carts/user/{user_uuid}:
 *   get:
 *     summary: Obter o carrinho de um usuário
 *     tags: [Cart]
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
 *         description: Carrinho retornado com sucesso
 *       400:
 *         description: Erro ao buscar o carrinho
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/user/:user_uuid",
  authMiddleware,
  (req: Request, res: Response) => {
    cartController.getCartByUser_UUID(req, res);
  }
);

/**
 * @swagger
 * /carts/user/{user_uuid}/item/{cartItem_id}:
 *   delete:
 *     summary: Excluir um item do carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do usuário
 *       - in: path
 *         name: cartItem_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item no carrinho
 *     responses:
 *       200:
 *         description: Item excluído com sucesso
 *       400:
 *         description: Erro ao excluir o item do carrinho
 *       500:
 *         description: Erro interno do servidor
 */
router.delete(
  "/user/:user_uuid/item/:cartItem_id",
  authMiddleware,
  (req: Request, res: Response) => {
    cartController.deleteCartItem(req, res);
  }
);

export default router;
