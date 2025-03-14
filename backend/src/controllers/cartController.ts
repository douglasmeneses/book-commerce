import { Request, Response } from "express";
import cartService from "../services/cartService";

const cartController = {
  addBookToCart: async (req: Request, res: Response) => {
    try {
      const user_uuid = req.params.user_uuid as string;
      const { book_uuid, quantity } = req.body;
      const cart = await cartService.addBooktoCart(
        user_uuid,
        book_uuid,
        quantity
      );
      if ("error" in cart) {
        return res.status(400).json({ error: cart.error });
      }
      return res.json(cart);
    } catch (error) {
      return res
        .status(500)
        .json({ error: error instanceof Error ? error.message : error });
    }
  },
};

export default cartController;
