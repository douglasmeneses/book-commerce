import { Decimal } from "@prisma/client/runtime/library";

export interface CartRequest {
  id: number;
  created_at: Date;
  updated_at: Date;
  totalPrice: Decimal;
  user_id: number;
  cartItem: {
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
      image_url: string | null;
    };
  }[];
}

export interface CartResponse {
  id: number;
  created_at: Date;
  updated_at: Date;
  totalPrice: Decimal;
  user_id: number;
  cartItem: {
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
      image_url: string | null;
    };
  }[];
}

export interface CartItemRequest {
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
    image_url: string | null;
  };
}

export interface CartItemResponse {
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
    image_url: string | null;
  };
}
