import { CartItem } from "../types/cartTypes";

export const sortCartItems = (cartItems: CartItem[]): CartItem[] => {
  return cartItems
    ? cartItems
        .map((item) => ({
          ...item,
          created_at: new Date(item.created_at),
        }))
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    : [];
};
