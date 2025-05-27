export class BookResponseDTO {
  uuid: string;
  id: number;
  title: string;
  synopsis: string;
  language: string;
  price: number;
  ISBN: string;
  rating: number;
  favorite_count: number;
  page_count: number;
  stock_quantity: number;
  release_date: string;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  image?: Buffer | null;
  authors: string[];
  genres: { name: string }[];
  favorites: { id: number }[];
  publishers: { name: string }[];

  constructor(book: any) {
    this.uuid = book.uuid;
    this.id = book.id;
    this.title = book.title;
    this.synopsis = book.synopsis;
    this.language = book.language;
    this.price = parseFloat(book.price.toString());
    this.ISBN = book.ISBN;
    this.rating = parseFloat(book.rating?.toString() || "0");
    this.favorite_count = book.favorite_count;
    this.page_count = book.page_count;
    this.stock_quantity = book.stock_quantity;
    this.release_date = book.release_date.toISOString();
    this.created_at = book.created_at.toISOString();
    this.updated_at = book.updated_at.toISOString();
    this.image_url = book.image_url;
    this.image = book.image;
    this.authors = book.authors.map((a: any) => a.author.name);
    this.genres = book.genres.map((g: any) => ({ name: g.genre.name }));
    this.favorites = Array.isArray(book.favorites)
      ? book.favorites.map((fav: any) => ({ id: fav.id }))
      : [];
    this.publishers = book.publishers.map((p: any) => ({
      name: p.publisher.name,
    }));
  }
}

export class BookDetailsDTO {
  uuid: string;
  title: string;
  synopsis: string;
  image_url?: string;
  price: number;
  authors: string[];
  rating?: number;
  genres: string[];
  publishers: string[];
  ISBN: string;
  language: string;
  page_count: number;
  release_date: string;
  stock_quantity: number;

  constructor(book: any) {
    this.uuid = book.uuid;
    this.title = book.title;
    this.synopsis = book.synopsis;
    this.image_url = book.image_url;
    this.price = book.price;
    this.authors = book.authors;
    this.rating = book.rating;
    this.genres = book.genres.map((g: any) => g.genre.name);
    this.publishers = book.publishers.map((p: any) => p.publisher.name);
    this.ISBN = book.ISBN;
    this.language = book.language;
    this.page_count = book.page_count;
    this.release_date = book.release_date;
    this.stock_quantity = book.stock_quantity;
  }
}
