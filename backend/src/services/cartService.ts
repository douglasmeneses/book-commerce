import { Cart, PrismaClient } from "@prisma/client";
import { userExists } from "../middlewares/userValidators";
import { bookExists } from "../middlewares/bookValidators";
import {
  cartValidates,
  removeBookToCartValidates,
} from "../middlewares/cartValidators";
import cartItemService from "./cartItem";
import { error } from "../types/bookTypes";
import { CartItemRequest, CartResponse } from "../types/cartTypes";
import recomendationService from "./recomendationService";
const prisma = new PrismaClient();

const cartService = {
  addBookToCart: async (
    user_uuid: string,
    book_uuid: string,
    quantity: number
  ) => {
    try {
      const validate = cartValidates(user_uuid, book_uuid, quantity);
      if (validate) return { error: validate.error };

      const user = await userExists(user_uuid);
      if ("error" in user) {
        return { error: user.error };
      }

      let findCart = await prisma.cart.findFirst({
        where: {
          user_id: user.id,
        },
      });

      if (!findCart) {
        findCart = await prisma.cart.create({
          data: {
            user_id: user.id,
          },
        });
      }

      const book = await bookExists(book_uuid);
      if ("error" in book) {
        return { error: book.error };
      }

      const cartItem = await cartItemService.addBookToCart(
        user.id,
        book.id,
        quantity
      );
      if ("error" in cartItem) {
        return { error: cartItem.error as string };
      }

      await prisma.cart.update({
        where: {
          id: findCart.id,
        },
        data: {
          totalPrice: findCart.totalPrice?.toNumber() + book.price * quantity,
        },
      });

      const cart = await cartService.getCartByUser_UUID(user_uuid);

      if (!cart) {
        return { error: "Cart not found!" };
      }

      await recomendationService.registerBookForRecomendations(
        book.id,
        user.id
      );

      return cart;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "error" };
    }
  },
  getCartById: async (id: number) => {
    try {
      const cart = await prisma.cart.findFirst({
        where: {
          id: id,
        },
        include: {
          cartItem: { include: { book: true } },
        },
      });

      if (!cart) {
        return { error: "Cart not found!" };
      }
      return cart;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "error" };
    }
  },
  getCartByUser_UUID: async (
    user_uuid: string
  ): Promise<CartResponse | { error: string }> => {
    try {
      const user = await userExists(user_uuid);
      if ("error" in user) {
        return { error: user.error };
      }

      const cart = await prisma.cart.findFirst({
        where: {
          user_id: user.id,
        },
        include: {
          cartItem: {
            include: {
              book: {
                include: {
                  authors: { include: { author: true } },
                  genres: { include: { genre: true } },
                  publishers: { include: { publisher: true } },
                },
              },
            },
          },
        },
      });
      if (!cart) {
        return { error: "Cart not found!" };
      }
      return cart;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "error" };
    }
  },
  removeBookToCart: async (
    user_uuid: string,
    cartItem_id: number,
    quantity: number
  ) => {
    try {
      const validates = removeBookToCartValidates(cartItem_id, quantity);
      if (validates) return { error: validates.error };

      const user = await userExists(user_uuid);
      if ("error" in user) return { error: user.error };

      const cart = await cartService.getCartByUser_UUID(user_uuid);
      if ("error" in cart) return { error: cart.error };

      const cartItem = await cartItemService.removeBookToCart(
        cartItem_id,
        quantity
      );

      if (!cartItem) return { error: "Cart item not found!" };

      if ("error" in cartItem) {
        return { error: cartItem.error as string };
      }

      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          totalPrice:
            cart.totalPrice?.toNumber() - cartItem.book.price * quantity,
        },
      });

      const updatedCart = await cartService.getCartByUser_UUID(user_uuid);
      if ("error" in updatedCart) {
        return { error: updatedCart.error };
      }
      return updatedCart;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "error" };
    }
  },
  deleteCartItem: async (user_uuid: string, cartItem_id: number) => {
    try {
      const user = await userExists(user_uuid);
      if ("error" in user) return { error: user.error };

      const cart = await cartService.getCartByUser_UUID(user_uuid);
      if ("error" in cart) return { error: cart.error };

      const cartItem = await cartItemService.getCartItemById(cartItem_id);
      if ("error" in cartItem) return { error: cartItem.error };

      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          totalPrice: cart.totalPrice?.toNumber() - cartItem.price.toNumber(),
        },
      });

      const deleteCartItem = await cartItemService.deleteCartItem(cartItem_id);
      if (deleteCartItem !== true && "error" in deleteCartItem)
        return { error: deleteCartItem.error };

      const updatedCart =
        deleteCartItem === true
          ? await cartService.getCartByUser_UUID(user_uuid)
          : { error: "error" };
      if ("error" in updatedCart) return { error: updatedCart.error };

      return updatedCart;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "error" };
    }
  },
};

export default cartService;
