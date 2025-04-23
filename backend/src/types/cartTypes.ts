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
      price: number;
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
  cartItem: CartItemRequest[];
}
export interface CartItemImageResponse {
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
    price: number;
    image: string | null;
    image_url: string | null;
  };
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
    price: number;
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
    uuid: string;
    title: string;
    price: number;
    image: string | null;
    image_url: string | null;
    stock_quantity: number;
    authors: {
      id: number;
      book_id: number;
      author_id: number;
      created_at: Date;
      updated_at: Date;
      author: {
        id: number;
        name: string;
        bio: string;
        year_of_birth: string;
        image: Record<string, unknown>;
        created_at: string;
        updated_at: string;
      };
    }[];
  };
}
