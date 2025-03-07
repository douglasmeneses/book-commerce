import { RegisterBook, Filter, UpdateBook } from "../types/bookTypes";
import { BookResponseDTO } from "../dtos/booksDTOs";
import { Book, PrismaClient } from "@prisma/client";
import userService from "./userService";
import validator from "validator";

const prisma = new PrismaClient();

const bookService = {
  bookRegister: async (
    book: RegisterBook,
    user_uuid: string
  ): Promise<Book | object> => {
    try {
      if (book.title.trim() === "") {
        return { error: "Title is required" };
      }
      if (book.synopsis.trim() === "") {
        return { error: "Synopsis is required" };
      }

      if (book.ISBN.trim() === "" || !validator.isISBN(book.ISBN)) {
        return { error: "ISBN is required" };
      }

      if (book.language.trim() === "" || !validator.isAlpha(book.language)) {
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

      if (!user_uuid || typeof user_uuid !== "string") {
        return { error: "User ID is required" };
      }
      const user = await userService.getUserByUUID(user_uuid);
      if (!user) {
        return { error: "User not found" };
      }
      if (!user.isAdmin) {
        return { error: "User Unauthorized" };
      }
      const existingBook = await prisma.book.findFirst({
        where: { ISBN: book.ISBN },
      });
      if (existingBook) {
        return { error: "ISBN already exists" };
      }
      const newBook = await prisma.book.create({
        data: {
          title: book.title,
          synopsis: book.synopsis,
          language: book.language,
          price: book.price,
          ISBN: book.ISBN,
          page_count: book.page_count,
          stock_quantity: book.stock_quantity || 0,
          image: book.image || null,
          release_date: releaseDate,
          stocks: {
            create: {
              quantity: book.stock_quantity || 0,
            },
          },
          authors: {
            create: book.authors.map((authorName) => ({
              author: {
                connectOrCreate: {
                  where: { name: authorName },
                  create: {
                    name: authorName,
                    bio: "",
                    year_of_birth: new Date(),
                    image: Buffer.alloc(0),
                  },
                },
              },
            })),
          },
          genres: {
            create: book.genres.map((genreName) => ({
              genre: {
                connectOrCreate: {
                  where: { name: genreName },
                  create: { name: genreName },
                },
              },
            })),
          },
          publishers: {
            create: book.publishers.map((publisherName) => ({
              publisher: {
                connectOrCreate: {
                  where: { name: publisherName },
                  create: { name: publisherName },
                },
              },
            })),
          },
        },
      });

      return newBook;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },
  getBooks: async (filter: Filter): Promise<Book[] | object> => {
    const { title, mostLiked, mostRecent } = filter;
    try {
      const books = await prisma.book.findMany({
        where: {
          title: title ? { contains: title, mode: "insensitive" } : undefined,
        },
        orderBy: [
          mostLiked ? { favorite_count: "desc" } : {},
          mostRecent ? { created_at: "desc" } : {},
        ],
        include: {
          authors: { include: { author: true } },
          genres: { include: { genre: true } },
        },
      });
      return books;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },
  getBookById: async (uuid: string): Promise<Book | object> => {
    if (!uuid || typeof uuid !== "string") {
      return { error: "Invalid UUID" };
    }

    try {
      const book = await prisma.book.findUnique({
        where: {
          uuid: uuid,
        },
        include: {
          authors: { include: { author: true } },
          genres: { include: { genre: true } },
          publishers: { include: { publisher: true } },
        },
      });

      if (!book) {
        return { error: "Book not found" };
      }

      return new BookResponseDTO(book);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },
  updateBook: async (
    uuid: string,
    user_uuid: string,
    book: UpdateBook
  ): Promise<Book | object> => {
    try {
      if (!uuid || typeof uuid !== "string") {
        return { error: "Invalid UUID" };
      }

      if (!user_uuid || typeof user_uuid !== "string") {
        return { error: "User ID is required" };
      }
      const user = await userService.getUserByUUID(user_uuid);
      if (!user) {
        return { error: "User not found" };
      }
      if (!user.isAdmin) {
        return { error: "User Unauthorized" };
      }
      const existingBook = await prisma.book.findUnique({
        where: { uuid: uuid },
      });

      if (!existingBook) {
        return { error: "Book not found" };
      }

      const updatedData: any = {};

      if (book.title && validator.isAscii(book.title)) {
        updatedData.title = book.title;
      }
      if (book.synopsis && validator.isAscii(book.synopsis)) {
        updatedData.synopsis = book.synopsis;
      }
      if (book.ISBN && validator.isISBN(book.ISBN)) {
        updatedData.ISBN = book.ISBN;
      }
      if (book.language && validator.isAlpha(book.language)) {
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

      const bookRecord = await prisma.book.update({
        where: { uuid: uuid },
        data: updatedData,
      });

      return bookRecord;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },

  bookDelete: async (uuid: string, user_uuid: string) => {
    try {
      if (!uuid || typeof uuid !== "string") {
        return { error: "Invalid UUID" };
      }

      if (!user_uuid || typeof user_uuid !== "string") {
        return { error: "User ID is required" };
      }

      const user = await userService.getUserByUUID(user_uuid);
      if (!user) {
        return { error: "User not found" };
      }

      if (!user.isAdmin) {
        return { error: "User Unauthorized" };
      }

      const book = await prisma.book.findUnique({
        where: { uuid: uuid },
      });

      if (!book) {
        return { error: "Book not found" };
      }

      await prisma.book.delete({
        where: { uuid: uuid },
      });

      return { message: "Book deleted successfully" };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },
};

export default bookService;
/**
  exemplo de requisição:
  {
      "title": "Harry Potter",
      "synopsis": "Harry Potter is a series of seven fantasy novels written by British author, J. K. Rowling.",
      "image": "https://www.google.com.br",
      "language": "English",
      "price": 50,
      "ISBN": "978-85-359-0277-8",
      "page_count": 500,
      "release_date": "1997-06-26",
      "genres": [1, 2],
      "authors": [1],
      "publisher": [1]
  }
*/
