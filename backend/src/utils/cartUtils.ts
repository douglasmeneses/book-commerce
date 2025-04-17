import sharp from "sharp";
import {
  CartItemResponse,
  CartItemRequest,
  CartItemImageResponse,
  CartResponse,
} from "../types/cartTypes";

export const processCartItems = async (cartItems: CartItemRequest[]) => {
  return Promise.all(
    cartItems.map(async (cartItem: CartItemRequest) => {
      if (cartItem.book.image) {
        const compressedImage = (cartItem.book.image = await sharp(
          Buffer.from(cartItem.book.image)
        )
          .resize(100)
          .jpeg({ quality: 70 })
          .toBuffer());

        const imageBase64 = Buffer.from(compressedImage).toString("base64");

        return {
          ...cartItem,
          book: {
            ...cartItem.book,
            image: `data:image/png;base64,${imageBase64}`,
            image_url: null,
          },
        };
      } else {
        return {
          ...cartItem,
          book: {
            ...cartItem.book,
            image: null,
          },
        };
      }
    })
  );
};
