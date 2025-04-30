export interface Author {
  id: number;
  name: string;
  bio: string;
  year_of_birth: string;
  image: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: number;
  book_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Genre {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface BookGenre {
  id: number;
  book_id: number;
  genre_id: number;
  created_at: string;
  updated_at: string;
  genre: Genre;
}

export interface Publisher {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface BookPublisher {
  id: number;
  book_id: number;
  publisher_id: number;
  created_at: string;
  updated_at: string;
  publisher: Publisher;
}

export interface Book {
  uuid: string;
  id: number;
  title: string;
  synopsis: string;
  language: string;
  price: string;
  ISBN: string;
  rating: string;
  favorite_count: number;
  page_count: number;
  stock_quantity: number;
  release_date: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  authors: string[];
  genres: BookGenre[];
  favorites?: Favorite[];
  publishers: BookPublisher[];
}

export interface BookCarouselProps {
  books: Array<Book>;
  genres?: Array<string>;
  title: string;
  handleFavoriteBook: (book_uuid: string) => void;
  isLogin: boolean;
}

export interface Filter {
  search?: string;
  limit?: number;
  page?: number;
  mostLiked?: boolean;
  mostRecent?: boolean;
}

export interface FavoriteBookResponse {
  id: number;
  book_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  book: Book;
}
