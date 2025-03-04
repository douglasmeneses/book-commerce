export class BookResponseDTO {
  uuid: string;
  title: string;
  synopsis: string;
  image: any;
  language: string;
  price: number;
  ISBN: string;
  rating: number;
  favorite_count: number;
  page_count: number;
  release_date: Date;
  created_at: Date;
  updated_at: Date;
  stock_quantity: number;
  authors: string[];
  genres: string[];
  publishers: string[];

  constructor(book: any) {
    this.uuid = book.uuid;
    this.title = book.title;
    this.synopsis = book.synopsis;
    this.image = book.image;
    this.language = book.language;
    this.price = book.price;
    this.ISBN = book.ISBN;
    this.rating = book.rating;
    this.favorite_count = book.favorite_count;
    this.page_count = book.page_count;
    this.release_date = book.release_date;
    this.created_at = book.created_at;
    this.updated_at = book.updated_at;
    this.stock_quantity = book.stocks?.quantity || 0;
    this.authors = book.authors.map((a: any) => a.author.name);
    this.genres = book.genres.map((g: any) => g.genre.name);
    this.publishers = book.publishers.map((p: any) => p.publisher.name);
  }
}
