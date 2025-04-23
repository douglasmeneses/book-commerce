import favoriteController from "../controllers/favoriteController";
import { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/book/:book_uuid", (req: Request, res: Response) => {
  favoriteController.favoriteBook(req, res);
});
router.get(
  "/user/:user_uuid",
  authMiddleware,
  (req: Request, res: Response) => {
    favoriteController.getFavorites(req, res);
  }
);

export default router;
