export interface Author {
  id: number;
  name: string;
  bio: string;
  year_of_birth: string;
  image: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Genre {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface BookAuthor {
  id: number;
  book_id: number;
  author_id: number;
  created_at: string;
  updated_at: string;
  author: Author;
}

export interface BookGenre {
  id: number;
  book_id: number;
  genre_id: number;
  created_at: string;
  updated_at: string;
  genre: Genre;
}

export interface Book {
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
  image: Uint8Array<ArrayBufferLike> | null;
  authors: BookAuthor[];
  genres: BookGenre[];
}
