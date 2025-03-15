export interface RegisterBook {
  title: string;
  synopsis: string;
  language: string;
  price: number;
  ISBN: string;
  page_count: number;
  image?: Buffer;
  release_date: Date;
  stock_quantity: number;
  authors: string[];
  genres: string[];
  publishers: string[];
}

export interface UpdateBook {
  uuid: string;
  title?: string;
  synopsis?: string;
  image?: Buffer;
  language?: string;
  price?: number;
  ISBN?: string;
  rating?: string;
  favorite_count?: number;
  page_count?: number;
  release_date?: Date;
  stock_quantity?: number;
  authors?: string[];
  genres?: string[];
  publishers?: string[];
}

export interface Filter {
  search?: string;
  author?: string;
  genre?: string;
  publisher?: string;
  isbn?: string;
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
