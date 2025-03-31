import { Request, Response } from "express";
import cartController from "../controllers/cartController";
import { authMiddleware } from "../middlewares/auth";
import { Router } from "express";

const router = Router();

router.post("/:user_uuid", authMiddleware, (req: Request, res: Response) => {
  cartController.addBookToCart(req, res);
});
router.put("/:id", authMiddleware, (req: Request, res: Response) => {
  cartController.removeBookToCart(req, res);
});
router.get("/:user_uuid", authMiddleware, (req: Request, res: Response) => {
  cartController.getCartByUser_UUID(req, res);
});
router.delete(
  "/:cartItem_id",
  authMiddleware,
  (req: Request, res: Response) => {
    cartController.deleteCartItem(req, res);
  }
);
export default router;
