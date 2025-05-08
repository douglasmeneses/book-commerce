import { Router, Request, Response } from "express";
import userController from "../controllers/userController";
import { authMiddleware } from "../middlewares/auth";
import upload from "../middlewares/upload";
import recomendationController from "../controllers/recomendationController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro ao registrar usuário
 */
router.post("/register", (req: Request, res: Response) => {
  userController.registerUser(req, res);
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", (req: Request, res: Response) => {
  userController.loginUser(req, res);
});

/**
 * @swagger
 * /users/{uuid}:
 *   get:
 *     summary: Obter informações do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/:uuid", authMiddleware, (req: Request, res: Response) => {
  userController.getUserByUUID(req, res);
});

/**
 * @swagger
 * /users/{uuid}:
 *   put:
 *     summary: Atualizar informações do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
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
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *               cpf:
 *                 type: string
 *               phone:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.put("/:uuid", authMiddleware, (req: Request, res: Response) => {
  userController.updateUserProfile(req, res);
});

/**
 * @swagger
 * /users/address/{uuid}:
 *   get:
 *     summary: Obter endereço do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do usuário
 *     responses:
 *       200:
 *         description: Endereço do usuário retornado com sucesso
 *       404:
 *         description: Endereço não encontrado
 */
router.get("/address/:uuid", authMiddleware, (req: Request, res: Response) => {
  userController.getUserAddress(req, res);
});

/**
 * @swagger
 * /users/recommendations/{uuid}:
 *   get:
 *     summary: Obter recomendações para o usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do usuário
 *     responses:
 *       200:
 *         description: Recomendações retornadas com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.get(
  "/recommendations/:uuid",
  authMiddleware,
  (req: Request, res: Response) => {
    recomendationController.getRecommendations(req, res);
  }
);

/**
 * @swagger
 * /users/{uuid}/upload:
 *   put:
 *     summary: Fazer upload do avatar do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do usuário
 *     requestBody:
 *       required: true
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
 *         description: Avatar atualizado com sucesso
 *       400:
 *         description: Erro ao fazer upload do avatar
 */
router.put(
  "/:uuid/upload",
  authMiddleware,
  upload.single("image"),
  (req: Request, res: Response) => {
    userController.uploadAvatar(req, res);
  }
);

/**
 * @swagger
 * /users/{uuid}:
 *   delete:
 *     summary: Excluir usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do usuário
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete("/:uuid", authMiddleware, (req: Request, res: Response) => {
  userController.deleteUser(req, res);
});

export default router;
