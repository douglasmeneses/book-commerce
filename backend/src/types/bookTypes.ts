import { Decimal } from "@prisma/client/runtime/library";
import { Book } from "@prisma/client";

export interface RegisterBook {
  title: string;
  synopsis: string;
  language: string;
  price: number;
  ISBN: string;
  page_count: number;
  image?: Buffer;
  image_url?: string;
  release_date: Date;
  stock_quantity: number;
  authors: string[];
  genres: string[];
  publishers: string[];
}

export interface UpdateBook {
  title?: string;
  synopsis?: string;
  image?: Buffer;
  language?: string;
  price?: number;
  ISBN?: string;
  rating?: Decimal;
  favorite_count?: number;
  page_count?: number;
  release_date?: Date;
  stock_quantity?: number;
  authors?: string[];
  genres?: string[];
  publishers?: string[];
}

export interface BookResponse {
  uuid: string;
  title: string;
  image?: string | null;
  image_url?: string | null;
  price: number;
  synopsis: string;
  authors: string[];
  rating?: number;
}

export interface Filter {
  search?: string;
  author?: string;
  genre?: string;
  publisher?: string;
  isbn?: string;
  title?: string;
  mostLiked?: boolean;
  mostRecent?: boolean;
  orderByPrice?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface error {
  error: string;
}

export interface ProcessedBook extends Omit<Book, "image"> {
  image: string | null;
}

export type BookWithConvertedRating = Omit<Book, "rating" | "price"> & {
  rating: number;
  price: number;
};
