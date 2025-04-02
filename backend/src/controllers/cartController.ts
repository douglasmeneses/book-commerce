import { Request, Response } from "express";
import cartService from "../services/cartService";
import { processCartItems } from "../utils/cartUtils";

const cartController = {
  addBookToCart: async (req: Request, res: Response) => {
    try {
      const user_uuid = req.params.user_uuid as string;
      const { book_uuid, quantity } = req.body;

      const cart = await cartService.addBookToCart(
        user_uuid,
        book_uuid,
        quantity
      );
      if ("error" in cart) return res.status(400).json({ error: cart.error });

      const cartItems = await processCartItems(cart.cartItem);

      return res.json({ ...cart, cartItem: cartItems });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error instanceof Error ? error.message : error });
    }
  },
  removeBookToCart: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user_uuid = req.body.user_uuid as string;
      const cartItem_id = parseInt(req.body.cartItem_id);
      const quantity = parseInt(req.body.quantity);

      const cart = await cartService.removeBookToCart(
        user_uuid,
        id,
        cartItem_id,
        quantity
      );
      if ("error" in cart) return res.status(400).json({ error: cart.error });

      const cartItems = await processCartItems(cart.cartItem);

      return res.json({ ...cart, cartItem: cartItems });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error instanceof Error ? error.message : error });
    }
  },
  getCartByUser_UUID: async (req: Request, res: Response) => {
    try {
      const user_uuid = req.params.user_uuid as string;
      const cart = await cartService.getCartByUser_UUID(user_uuid);
      if ("error" in cart) return res.status(400).json({ error: cart.error });

      const cartItems = await processCartItems(cart.cartItem);

      return res.json({ ...cart, cartItem: cartItems });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error instanceof Error ? error.message : error });
    }
  },
  deleteCartItem: async (req: Request, res: Response) => {
    try {
      const cartItem_id = parseInt(req.params.cartItem_id);
      const { user_uuid, id } = req.body as {
        user_uuid: string;
        id: number;
      };

      const cart = await cartService.deleteCartItem(user_uuid, id, cartItem_id);

      if ("error" in cart) return res.status(400).json({ error: cart.error });

      const cartItems = await processCartItems(cart.cartItem);

      return res.json({ ...cart, cartItem: cartItems });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error instanceof Error ? error.message : error });
    }
  },

  getRecommendedBooks: async (req: Request, res: Response) => {
    try {
      const user_uuid = req.params.user_uuid as string;
      const reccomendations = await cartService.getRecommendedBooks(user_uuid);
      if ("error" in reccomendations)
        return res.status(400).json({ error: reccomendations.error });

      return res.json(reccomendations);
    } catch (error) {
      return res
        .status(500)
        .json({ error: error instanceof Error ? error.message : error });
    }
  },
};

export default cartController;
