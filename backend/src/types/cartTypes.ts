import { Decimal } from "@prisma/client/runtime/library";

export interface CartResponse {
  id: number;
  created_at: Date;
  updated_at: Date;
  totalPrice: Decimal;
  user_id: number;
  CartItem: {
    id: number;
    created_at: Date;
    updated_at: Date;
    price: Decimal;
    cart_id: number;
    book_id: number;
    quantity: number;
    book: {
      id: number;
      title: string;
      price: Decimal;
      image: Uint8Array | null;
    };
  }[];
}
