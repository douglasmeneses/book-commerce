import bookController from "../controllers/bookController";
import { Request, Response } from "express";
import { Router } from "express";
import upload from "../middlewares/upload";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Endpoints para gerenciamento de livros
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Cadastrar um novo livro
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book:
 *                 $ref: '#/components/schemas/RegisterBook'
 *               user_uuid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Livro cadastrado com sucesso
 *       400:
 *         description: Erro ao cadastrar livro
 */
router.post("/", authMiddleware, (req: Request, res: Response) => {
  bookController.registerBook(req, res);
});

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Obter lista de livros com filtros
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 */
router.get("/", (req: Request, res: Response) => {
  bookController.getBooks(req, res);
});

/**
 * @swagger
 * /books/{uuid}:
 *   get:
 *     summary: Obter detalhes de um livro
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livro encontrado
 *       404:
 *         description: Livro não encontrado
 */
router.get("/:uuid", (req: Request, res: Response) => {
  bookController.getBookByUUID(req, res);
});

/**
 * @swagger
 * /books/{uuid}:
 *   put:
 *     summary: Atualizar um livro
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBook'
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 */
router.put("/:uuid", authMiddleware, (req: Request, res: Response) => {
  bookController.bookUpdate(req, res);
});

/**
 * @swagger
 * /books/{uuid}:
 *   delete:
 *     summary: Remover um livro
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livro deletado com sucesso
 */
router.delete("/:uuid", authMiddleware, (req: Request, res: Response) => {
  bookController.bookDelete(req, res);
});

/**
 * @swagger
 * /books/{uuid}/upload:
 *   put:
 *     summary: Fazer upload de imagem para um livro
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 */
router.put(
  "/:uuid/upload",
  authMiddleware,
  upload.single("image"),
  (req, res) => {
    bookController.uploadBookImage(req, res);
  }
);

export default router;
