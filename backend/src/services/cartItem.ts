import { CartItem, PrismaClient } from "@prisma/client";
import bookService from "./bookService";
import { error } from "../types/bookTypes";

const prisma = new PrismaClient();

const cartItemService = {
  addBookToCart: async (
    user_id: number,
    book_id: number,
    quantity: number
  ): Promise<CartItem | error> => {
    try {
      const cart = await prisma.cart.findFirst({
        where: { user_id: user_id },
      });
      if (!cart) return { error: "Cart not found" };

      const book = await bookService.getBookById(book_id);
      if ("error" in book) return { error: book.error };

      if (!quantity || typeof quantity !== "number" || quantity < 1)
        return { error: "Invalid quantity" };
      if (quantity > book.stock_quantity) return { error: "Not enough stock" };

      let cartItem = await prisma.cartItem.findFirst({
        where: {
          cart_id: cart.id,
          book_id: book_id,
        },
      });

      if (!cartItem) {
        cartItem = await prisma.cartItem.create({
          data: {
            cart_id: cart.id,
            book_id: book_id,
            quantity: quantity,
          },
        });
      }

      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItem.quantity + quantity,
          price: cartItem.price?.toNumber() + quantity * book.price?.toNumber(),
        },
      });

      return cartItem;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "error" };
    }
  },
};

export default cartItemService;
