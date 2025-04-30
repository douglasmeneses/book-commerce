import { CartItem, PrismaClient } from "@prisma/client";
import bookService from "./bookService";
import { error } from "../types/bookTypes";

const prisma = new PrismaClient();

const cartItemService = {
  getCartItemById: async (id: number): Promise<CartItem | error> => {
    try {
      const cartItem = await prisma.cartItem.findFirst({
        where: { id: id },
      });

      if (!cartItem) {
        return { error: "Cart item not found!" };
      }

      return cartItem;
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "error ao buscar item do carrinho",
      };
    }
  },
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
            quantity: 0,
          },
        });
      }

      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItem.quantity + quantity,
          price: cartItem.price?.toNumber() + quantity * book.price,
        },
      });

      return cartItem;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "error" };
    }
  },
  removeBookToCart: async (id: number, quantity: number) => {
    try {
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: id,
        },
        include: {
          book: true,
        },
      });

      if (!cartItem) {
        return { error: "Cart item not found!" };
      }

      if (cartItem.quantity <= quantity) {
        return { error: "Invalid quantity" };
      }

      await prisma.cartItem.update({
        where: {
          id: id,
        },
        data: {
          quantity: cartItem.quantity - quantity,
          price: cartItem.price?.toNumber() - quantity * cartItem.book.price,
        },
      });

      const updatedCartItem = await prisma.cartItem.findFirst({
        where: {
          id: id,
        },
        include: {
          book: true,
        },
      });

      return updatedCartItem;
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "error ao remover item do carrinho",
      };
    }
  },
  deleteCartItem: async (id: number): Promise<true | error> => {
    try {
      const cartItem = await prisma.cartItem.findFirst({
        where: { id: id },
      });

      if (!cartItem) {
        return { error: "Cart item not found!" };
      }

      await prisma.cartItem.delete({
        where: { id: id },
      });

      return true;
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "error ao deletar item do carrinho",
      };
    }
  },
};

export default cartItemService;
