import { Request, Response } from "express";
import cartController from "../controllers/cartController";
import { Router } from "express";

const router = Router();

router.post("/:user_uuid", (req: Request, res: Response) => {
  cartController.addBookToCart(req, res);
});
export default router;
