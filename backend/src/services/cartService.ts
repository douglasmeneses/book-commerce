import { Cart, PrismaClient } from "@prisma/client";
import { userExists } from "../middlewares/userValidators";
import { bookExists } from "../middlewares/bookValidators";
import { cartValidates } from "../middlewares/cartValidators";
import cartItemService from "./cartItem";
import { error } from "../types/bookTypes";

const prisma = new PrismaClient();

const cartService = {
  addBooktoCart: async (
    user_uuid: string,
    book_uuid: string,
    quantity: number
  ): Promise<error | Cart> => {
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
        return { error: cartItem.error };
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
          CartItem: { include: { book: true } },
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
};

export default cartService;
