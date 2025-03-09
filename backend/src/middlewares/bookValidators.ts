import validator from "validator";
import { RegisterBook, UpdateBook, error } from "../types/bookTypes";
import { Book, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const bookValidates = async (book: RegisterBook) => {
  if (book.title.trim() === "") {
    return { error: "Title is required" };
  }
  if (
    book.synopsis.trim() === "" ||
    !validator.isAlpha(book.language, "pt-BR", { ignore: " " })
  ) {
    return { error: "Synopsis is required" };
  }

  if (book.ISBN.trim() === "" || !validator.isISBN(book.ISBN)) {
    return { error: "ISBN is required" };
  }

  if (
    book.language.trim() === "" ||
    !validator.isAlpha(book.language, "pt-BR", { ignore: " " })
  ) {
    return { error: "Language is required" };
  }

  if (book.price <= 0) {
    return { error: "Price is required" };
  }

  if (book.page_count <= 0) {
    return { error: "Page count is required" };
  }

  if (book.stock_quantity < 0 || !Number.isInteger(book.stock_quantity)) {
    return { error: "Stock quantity is required" };
  }

  if (book.image && !(book.image instanceof Uint8Array)) {
    return { error: "Valid image is required" };
  }
  const releaseDate = new Date(book.release_date);
  if (isNaN(releaseDate.getTime())) {
    return { error: "Invalid release date" };
  }

  if (book.authors.length === 0) {
    return { error: "Authors are required" };
  }
  if (book.genres.length === 0) {
    return { error: "Genres are required" };
  }
  const existingBook = await prisma.book.findFirst({
    where: { ISBN: book.ISBN },
  });
  if (existingBook) {
    return { error: "ISBN already exists" };
  }
  return null;
};

export const bookExists = async (uuid: string): Promise<error | Book> => {
  if (!uuid || typeof uuid !== "string") {
    return { error: "Book ID is required" };
  }
  const book = await prisma.book.findFirst({ where: { uuid } });
  if (!book) {
    return { error: "Book not found" };
  }
  return book;
};

export const extractBookData = async (uuid: string, book: UpdateBook) => {
  const updatedData: any = {};

  if (
    book.title &&
    validator.isAlphanumeric(book.title, "pt-BR", { ignore: " :" })
  ) {
    updatedData.title = book.title;
  }
  if (
    book.synopsis &&
    validator.isAlphanumeric(book.synopsis, "pt-BR", { ignore: " :" })
  ) {
    updatedData.synopsis = book.synopsis;
  }
  if (book.ISBN && validator.isISBN(book.ISBN)) {
    const existingBook = await prisma.book.findFirst({
      where: { ISBN: book.ISBN },
    });
    existingBook && existingBook.uuid == uuid
      ? (updatedData.ISBN = book.ISBN)
      : (updatedData.ISBN = book.ISBN);
  }

  if (
    book.language &&
    validator.isAlpha(book.language, "pt-BR", { ignore: " " })
  ) {
    updatedData.language = book.language;
  }
  if (book.price && book.price > 0) {
    updatedData.price = book.price;
  }
  if (book.page_count && book.page_count > 0) {
    updatedData.page_count = book.page_count;
  }
  if (book.stock_quantity && book.stock_quantity >= 0) {
    updatedData.stock_quantity = book.stock_quantity;
  }
  if (book.release_date) {
    const releaseDate = new Date(book.release_date);
    if (!isNaN(releaseDate.getTime())) {
      updatedData.release_date = releaseDate;
    }
  }

  return updatedData;
};

export const updateAuthors = async (id: number, authors?: string[]) => {
  if (!authors) return;
  await prisma.bookAuthor.deleteMany({
    where: { book_id: id },
  });

  for (const authorName of authors) {
    let author = await prisma.author.findFirst({
      where: { name: authorName },
    });
    if (!author) {
      author = await prisma.author.create({
        data: {
          name: authorName,
          bio: "",
          year_of_birth: new Date(),
          image: Buffer.alloc(0),
        },
      });
    }
    await prisma.bookAuthor.create({
      data: {
        author_id: author.id,
        book_id: id,
      },
    });
  }
};
export const updateGenres = async (id: number, genres?: string[]) => {
  if (!genres) return;
  await prisma.bookGenre.deleteMany({
    where: { book_id: id },
  });

  for (const genreName of genres) {
    let genre = await prisma.genre.findFirst({
      where: { name: genreName },
    });
    if (!genre) {
      genre = await prisma.genre.create({
        data: {
          name: genreName,
        },
      });
    }
    await prisma.bookGenre.create({
      data: {
        genre_id: genre.id,
        book_id: id,
      },
    });
  }
};
export const updatePublishers = async (id: number, publishers?: string[]) => {
  if (!publishers) return;
  await prisma.bookPublisher.deleteMany({
    where: { book_id: id },
  });

  for (const publisherName of publishers) {
    let publisher = await prisma.publisher.findFirst({
      where: { name: publisherName },
    });
    if (!publisher) {
      publisher = await prisma.publisher.create({
        data: {
          name: publisherName,
        },
      });
    }
    await prisma.bookPublisher.create({
      data: {
        publisher_id: publisher.id,
        book_id: id,
      },
    });
  }
};
