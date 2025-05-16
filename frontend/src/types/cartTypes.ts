export interface Cart {
  totalPrice: number;
  cartItem: CartItem[];
}

export interface CartItem {
  id: number;
  created_at: Date;
  updated_at: Date;
  price: number;
  quantity: number;
  book: Book;
  cart_id: number;
}

export interface Book {
  uuid: string;
  title: string;
  price: number;
  image: Uint8Array | null;
  image_url: string | null;
  stock_quantity: number;
  authors: string[];
}
