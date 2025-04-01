import { Cart, PrismaClient, Recommendation } from "@prisma/client";
import { userExists } from "../middlewares/userValidators";
import { bookExists } from "../middlewares/bookValidators";
import {
  cartValidates,
  removeBookToCartValidates,
} from "../middlewares/cartValidators";
import cartItemService from "./cartItem";
import { error } from "../types/bookTypes";
import { CartResponse } from "../types/cartTypes";
import { get } from "axios";

const prisma = new PrismaClient();

const cartService = {
  addBookToCart: async (
    user_uuid: string,
    book_uuid: string,
    quantity: number
  ): Promise<error | CartResponse> => {
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
          totalPrice:
            findCart.totalPrice?.toNumber() + book.price.toNumber() * quantity,
        },
      });

      const cart = await prisma.cart.findFirst({
        where: {
          user_id: user.id,
        },
        include: {
          cartItem: { include: { book: true } },
        },
      });

      if (!cart) {
        return { error: "Cart not found!" };
      }

      await prisma.recommendation.create({
        data: {
          user_id: user.id,
          book_id: book.id,
        },
      });

      return cart as CartResponse;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "error" };
    }
  },
  getCartById: async (id: number): Promise<CartResponse | error> => {
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
  getCartByUser_UUID: async (user_uuid: string) => {
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
  removeBookToCart: async (
    user_uuid: string,
    id: number,
    cartItem_id: number,
    quantity: number
  ): Promise<error | CartResponse> => {
    try {
      const validates = removeBookToCartValidates(id, cartItem_id, quantity);
      if (validates) return { error: validates.error };

      const user = await userExists(user_uuid);
      if ("error" in user) return { error: user.error };

      const cart = await cartService.getCartById(id);
      if ("error" in cart) return { error: cart.error };

      if (user.id !== cart.user_id)
        return { error: "User not allowed to remove this item" };

      const cartItem = await cartItemService.removeBookToCart(
        cartItem_id,
        quantity
      );
      if ("error" in cartItem) {
        return { error: cartItem.error as string };
      }

      await prisma.cart.update({
        where: {
          id: id,
        },
        data: {
          totalPrice:
            cart.totalPrice?.toNumber() -
            cartItem.book.price.toNumber() * quantity,
        },
      });

      const updatedCart = await cartService.getCartById(id);
      if ("error" in updatedCart) {
        return { error: updatedCart.error };
      }
      return updatedCart;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "error" };
    }
  },
  deleteCartItem: async (
    user_uuid: string,
    id: number,
    cartItem_id: number
  ): Promise<CartResponse | error> => {
    try {
      const user = await userExists(user_uuid);
      if ("error" in user) return { error: user.error };

      const cart = await cartService.getCartById(id);
      if ("error" in cart) return { error: cart.error };

      if (user.id !== cart.user_id)
        return { error: "User not allowed to remove this item" };

      const cartItem = await cartItemService.getCartItemById(cartItem_id);
      if ("error" in cartItem) return { error: cartItem.error };

      if (cartItem.cart_id !== id)
        return { error: "Cart item not found in this cart" };

      await prisma.cart.update({
        where: {
          id: id,
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
          ? await cartService.getCartById(id)
          : { error: "error" };
      if ("error" in updatedCart) return { error: updatedCart.error };

      return updatedCart;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "error" };
    }
  },

  getRecommendedBooks: async (user_uuid: string) => {
    const recommendations = await prisma.recommendation.findMany({
      where: {
        user_uuid: user_uuid,
      },
      include: {
        book: true,
      },
    });

    if (!recommendations) {
      return { error: "Recommendations not found!" };
    }

    return recommendations;
  },
};

export default cartService;
