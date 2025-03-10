import favoriteController from "../controllers/favoriteController";
import { Request, Response } from "express";
import { Router } from "express";

const router = Router();

router.post("/:book_uuid", (req: Request, res: Response) => {
  favoriteController.favoriteBook(req, res);
});
//router.get("/favorites", favoriteController.getFavorites);

export default router;
