export class BookResponseDTO {
  uuid: string;
  title: string;
  synopsis: string;
  image?: any;
  image_url?: string;
  price: number;
  authors: string[];
  rating?: number;
  favorites: { id: number }[];

  constructor(book: any) {
    this.uuid = book.uuid;
    this.title = book.title;
    this.image = book.image;
    this.price = book.price;
    this.synopsis = book.synopsis;
    this.authors = book.authors.map((a: any) => a.author.name);
    this.image_url = book.image_url;
    this.rating = book.rating;
    this.favorites = Array.isArray(book.favorites)
      ? book.favorites.map((fav: any) => ({ id: fav.id }))
      : [];
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
