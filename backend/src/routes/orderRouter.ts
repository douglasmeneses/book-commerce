import { Router, Request, Response } from "express";
import * as orderController from "../controllers/orderController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /orders/{user_uuid}:
 *   post:
 *     summary: Criar um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     book_uuid:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               total_price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Erro ao criar o pedido
 */
router.post("/:user_uuid", authMiddleware, (req: Request, res: Response) => {
  orderController.createOrder(req, res);
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obter detalhes de um pedido pelo ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Detalhes do pedido retornados com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.get("/:id", authMiddleware, (req: Request, res: Response) => {
  orderController.getOrderById(req, res);
});

/**
 * @swagger
 * /orders/{user_uuid}:
 *   put:
 *     summary: Atualizar um pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     book_uuid:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               total_price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.put("/:user_uuid", authMiddleware, (req: Request, res: Response) => {
  orderController.updateOrder(req, res);
});

/**
 * @swagger
 * /orders/{user_uuid}:
 *   delete:
 *     summary: Excluir um pedido
 *     tags: [Orders]
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
 *         description: Pedido excluído com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete("/:user_uuid", authMiddleware, (req: Request, res: Response) => {
  orderController.deleteOrder(req, res);
});

/**
 * @swagger
 * /orders/user/{user_uuid}:
 *   get:
 *     summary: Obter todos os pedidos de um usuário
 *     tags: [Orders]
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
 *         description: Lista de pedidos retornada com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.get(
  "/user/:user_uuid",
  authMiddleware,
  (req: Request, res: Response) => {
    orderController.getOrdersByUser(req, res);
  }
);

export default router;
