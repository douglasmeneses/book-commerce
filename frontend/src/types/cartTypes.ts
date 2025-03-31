export interface Cart {
  id: number;
  created_at: Date;
  updated_at: Date;
  totalPrice: number;
  user_id: number;
  cartItem: CartItem[];
}

interface Authors {
  id: number;
  book_id: number;
  author_id: number;
  created_at: Date;
  updated_at: Date;
  author: {
    id: number;
    name: string;
    bio: string;
    year_of_birth: Date;
    created_at: Date;
    updated_at: Date;
  };
}

export interface CartItem {
  id: number;
  created_at: Date;
  updated_at: Date;
  price: number;
  cart_id: number;
  book_id: number;
  quantity: number;
  book: {
    uuid: string;
    id: number;
    title: string;
    synopsis: string;
    image: string | null;
    image_url: string | null;
    language: string;
    price: number;
    ISBN: string;
    rating: string;
    favorite_count: number;
    page_count: number;
    stock_quantity: number;
    release_date: Date;
    created_at: Date;
    updated_at: Date;
    authors: Authors[];
    //genres:{}[];
    //publisher:{}[];
  };
}
