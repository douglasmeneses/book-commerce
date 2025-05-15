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
