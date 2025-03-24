import { CartItem } from "@prisma/client";
import { processImage } from "./bookUtils";

export const processCartItems = async (
  cartItems: Array<any>
): Promise<Array<any>> => {
  return Promise.all(
    cartItems.map(async (cartItem) => ({
      ...cartItem,
      book: {
        ...cartItem.book,
        image: `data:image/png;base64,${
          cartItem.book.image
            ? await processImage(Buffer.from(cartItem.book.image))
            : null
        }`,
      },
    }))
  );
};
