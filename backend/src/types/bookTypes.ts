export interface registerBook {
  title: string;
  synopsis: string;
  language: string;
  price: number;
  ISBN: string;
  page_count: number;
  image: Uint8Array<ArrayBufferLike>;
  release_date: Date;
  stock_quantity: number;
  authors: string[]; // Lista de nomes dos autores
  genres: string[]; // Lista de gêneros
  publishers: string[]; // Lista de editoras
}

export interface error {
  error: string;
}
