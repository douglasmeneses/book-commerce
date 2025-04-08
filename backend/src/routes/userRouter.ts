import { Router, Request, Response } from "express";
import userController from "../controllers/userController";
import { authMiddleware } from "../middlewares/auth";
import upload from "../middlewares/upload";

const router = Router();

router.post("/register", (req: Request, res: Response) => {
  userController.registerUser(req, res);
});

router.post("/login", (req: Request, res: Response) => {
  userController.loginUser(req, res);
});

router.get("/:uuid", authMiddleware,(req: Request, res: Response) => {
  userController.getUserByUUID(req, res);
});

router.put("/:uuid", authMiddleware, (req: Request, res: Response) => {
  userController.updateUserProfile(req, res);
});
//rota de upload de imagem com a proteção
router.put(
  "/:uuid/upload",
  authMiddleware,
  upload.single("image"),
  (req: Request, res: Response) => {
    userController.uploadAvatar(req, res);
  }
);

router.delete("/:uuid", authMiddleware, (req: Request, res: Response) => {
  userController.deleteUser(req, res);
});

export default router;