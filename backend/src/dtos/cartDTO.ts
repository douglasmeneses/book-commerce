import { Decimal } from "@prisma/client/runtime/library";

import {
  CartResponse as CartResponseInterface,
  CartItemResponse,
} from "../types/cartTypes";

export class CartResponseDTO {
  id: number;
  totalPrice: number;
  cartItem: {
    created_at: Date;
    updated_at: Date;
    price: Decimal;
    quantity: number;
    book: {
      title: string;
      price: Decimal;
      image: Uint8Array | null;
      image_url: string | null;
      stock_quantity: number;
      authors: string[];
    };
  }[];

  constructor(cart: any) {
    this.id = cart.id;
    this.totalPrice = parseFloat(cart.totalPrice);
    this.cartItem = cart.cartItem.map((item: CartItemResponse) => ({
      created_at: item.created_at,
      updated_at: item.updated_at,
      price: item.price,
      quantity: item.quantity,
      book: {
        title: item.book.title,
        price: item.book.price,
        image: item.book.image,
        image_url: item.book.image_url,
        stock_quantity: item.book.stock_quantity,
        authors: item.book.authors.map((author: any) => author.author.name),
      },
    }));
  }
}
