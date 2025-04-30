import { Request, Response } from "express";
import cartService from "../services/cartService";
import { processCartItems } from "../utils/cartUtils";
import { CartResponseDTO } from "../dtos/cartDTO";
import { CartItemRequest } from "../types/cartTypes";

const cartController = {
  addBookToCart: async (req: Request, res: Response) => {
    try {
      const user_uuid = req.params.user_uuid as string;
      const book_uuid = req.params.book_uuid as string;
      const quantity = req.body.quantity as number;

      const cart = await cartService.addBookToCart(
        user_uuid,
        book_uuid,
        quantity
      );
      if ("error" in cart) return res.status(400).json({ error: cart.error });

      const cartItems = await processCartItems(cart.cartItem);

      const cartResponse = new CartResponseDTO({
        ...cart,
        cartItem: cartItems,
      });
      return res.json(cartResponse);
    } catch (error) {
      return res
        .status(500)
        .json({ error: error instanceof Error ? error.message : error });
    }
  },
  removeBookToCart: async (req: Request, res: Response) => {
    try {
      const user_uuid = req.params.user_uuid as string;
      const cartItem_id = parseInt(req.params.cartItem_id);
      const quantity = parseInt(req.body.quantity);

      const cart = await cartService.removeBookToCart(
        user_uuid,
        cartItem_id,
        quantity
      );
      if ("error" in cart) return res.status(400).json({ error: cart.error });

      const cartItems = await processCartItems(cart.cartItem);

      const cartResponse = new CartResponseDTO({
        ...cart,
        cartItem: cartItems,
      });
      return res.json(cartResponse);
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

      const cartResponse = new CartResponseDTO({
        ...cart,
        cartItem: cartItems,
      });
      return res.json(cartResponse);
    } catch (error) {
      return res
        .status(500)
        .json({ error: error instanceof Error ? error.message : error });
    }
  },
  deleteCartItem: async (req: Request, res: Response) => {
    try {
      const user_uuid = req.params.user_uuid as string;
      const cartItem_id = parseInt(req.params.cartItem_id);

      const cart = await cartService.deleteCartItem(user_uuid, cartItem_id);

      if ("error" in cart) return res.status(400).json({ error: cart.error });

      const cartItems = await processCartItems(cart.cartItem);

      const cartResponse = new CartResponseDTO({
        ...cart,
        cartItem: cartItems,
      });
      return res.json(cartResponse);
    } catch (error) {
      return res
        .status(500)
        .json({ error: error instanceof Error ? error.message : error });
    }
  },
};

export default cartController;
