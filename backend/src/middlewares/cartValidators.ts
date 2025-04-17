import { error } from "../types/bookTypes";

export const cartValidates = (
  user_uuid: string,
  book_uuid: string,
  quantity: number
): error | null => {
  try {
    if (!user_uuid || typeof user_uuid !== "string")
      return { error: "Invalid user id" };

    if (!book_uuid || typeof book_uuid !== "string")
      return { error: "Invalid book id" };

    if (!quantity || typeof quantity !== "number" || quantity < 1)
      return { error: "Invalid quantity" };

    return null;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "erro na validação",
    };
  }
};

export const removeBookToCartValidates = (
  cartItem_id: number,
  quantity: number
): error | null => {
  if (!cartItem_id || typeof cartItem_id !== "number") {
    return { error: "Invalid cart item id" };
  }

  if (!quantity || typeof quantity !== "number" || quantity < 1) {
    return { error: "Invalid quantity" };
  }

  return null;
};
