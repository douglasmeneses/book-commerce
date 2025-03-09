export interface RegisterBook {
  title: string;
  synopsis: string;
  language: string;
  price: number;
  ISBN: string;
  page_count: number;
  image?: Uint8Array<ArrayBufferLike>;
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
  image?: Uint8Array;
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
  title?: string;
  mostLiked?: boolean;
  mostRecent?: boolean;
}

export interface error {
  error: string;
}
