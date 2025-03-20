import { Router, Request, Response } from "express";
import * as userController from "../controllers/userController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/register", (req: Request, res: Response) => {
  userController.registerUser(req, res);
});

router.post("/login", (req: Request, res: Response) => {
  userController.loginUser(req, res);
});

router.get("/:uuid", (req: Request, res: Response) => {
  userController.getUserProfile(req, res);
});

router.put("/:uuid", authMiddleware, (req: Request, res: Response) => {
  userController.updateUserProfile(req, res);
});

router.delete("/:uuid", authMiddleware, (req: Request, res: Response) => {
  userController.deleteUser(req, res);
});

export default router;
