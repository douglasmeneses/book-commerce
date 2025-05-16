import { RegisterBook, Filter, UpdateBook, error } from "../types/bookTypes";
import { Book, PrismaClient } from "@prisma/client";
import {
  bookExists,
  bookValidates,
  extractBookData,
} from "../middlewares/bookValidators";
import { updateAuthors } from "./authorService";
import { updateGenres } from "./genreService";
import { updatePublishers } from "./publisherService";
import { userExists, validUser } from "../middlewares/userValidators";
import { BookResponseDTO } from "../dtos/booksDTOs";
import redisClient from "../redisClient";
import { bookWhere, handleError } from "../utils/bookUtils";

const CACHE_EXPIRATION = 60 * 60 * 24;

const prisma = new PrismaClient();

const bookService = {
  bookRegister: async (
    book: RegisterBook,
    user_uuid: string
  ): Promise<Book | error> => {
    try {
      const validation = await bookValidates(book);
      if (validation && "error" in validation) {
        return { error: validation.error };
      }

      const userValidation = await validUser(user_uuid);
      if (userValidation && "error" in userValidation) {
        return { error: userValidation.error };
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
          image: book.image ? Buffer.from(book.image) : null,
          image_url: book.image ? book.image_url : null,
          release_date: new Date(book.release_date),
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
      return handleError(error);
    }
  },

  getBooks: async (
    filter: Filter,
    user_uuid?: string
  ): Promise<BookResponseDTO[] | error> => {
    const { mostLiked, mostRecent, orderByPrice, page, limit } = filter;

    const user = user_uuid ? await userExists(user_uuid) : null;
    if (user && "error" in user) return { error: user.error };

    const skip = page && limit ? (page - 1) * limit : 0;

    const where = await bookWhere(filter);

    const orderBy: any[] = [];
    if (mostLiked) orderBy.push({ favorite_count: "desc" });
    if (mostRecent) orderBy.push({ created_at: "desc" });
    if (orderByPrice) orderBy.push({ price: orderByPrice });

    const cacheKey = `books:${JSON.stringify({
      mostLiked,
      mostRecent,
      page,
      limit,
    })}`;

    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const books = await prisma.book.findMany({
        where,
        orderBy,
        include: {
          authors: { include: { author: true } },
          genres: { include: { genre: true } },
          publishers: { include: { publisher: true } },
          favorites: user ? { where: { user_id: user.id } } : undefined,
        },
        take: limit,
        skip,
      });
      const booksDTO = books.map((book) => new BookResponseDTO(book));

      await redisClient.set(cacheKey, JSON.stringify(booksDTO), {
        EX: CACHE_EXPIRATION,
      });

      return booksDTO;
    } catch (error) {
      return handleError(error);
    }
  },
  getBookById: async (id: number): Promise<Book | error> => {
    if (!id || typeof id !== "number") {
      return { error: "Invalid ID" };
    }

    try {
      const book = await prisma.book.findUnique({
        where: {
          id: id,
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

      return book;
    } catch (error) {
      return handleError(error);
    }
  },
  getBookByUUID: async (
    uuid: string,
    user_uuid?: string
  ): Promise<Book | error> => {
    if (!uuid || typeof uuid !== "string") {
      return { error: "Invalid UUID" };
    }
    if (user_uuid && typeof user_uuid !== "string") {
      return { error: "Invalid UUID" };
    }

    const user = user_uuid && (await userExists(user_uuid));
    if (user && "error" in user) {
      return { error: user.error };
    }

    try {
      const book = await prisma.book.findUnique({
        where: { uuid: uuid },
        include: {
          authors: { include: { author: true } },
          genres: { include: { genre: true } },
          publishers: { include: { publisher: true } },
          favorites: user ? { where: { user_id: user.id } } : undefined,
        },
      });

      if (!book) {
        return { error: "Book not found" };
      }

      return book;
    } catch (error) {
      return handleError(error);
    }
  },
  getBookByISBN: async (isbn: string): Promise<Book | null> => {
    const book = await prisma.book.findFirst({
      where: { ISBN: isbn },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } },
        publishers: { include: { publisher: true } },
      },
    });

    if (!book) {
      return null;
    }

    return book;
  },
  updateBook: async (
    uuid: string,
    user_uuid: string,
    bookData: UpdateBook
  ): Promise<Book | error> => {
    try {
      const userValidation = await validUser(user_uuid);
      if (userValidation && "error" in userValidation) {
        return { error: userValidation.error };
      }

      const book = await bookExists(uuid);
      if (book && "error" in book) {
        return { error: book.error };
      }
      const updatedData: any = await extractBookData(uuid, bookData);

      await prisma.book.update({
        where: { uuid: uuid },
        data: updatedData,
      });

      await updateAuthors(book.id, bookData.authors);
      await updateGenres(book.id, bookData.genres);
      await updatePublishers(book.id, bookData.publishers);

      const updatedBook = await prisma.book.findUnique({
        where: { id: book.id },
        include: {
          authors: { include: { author: true } },
          genres: { include: { genre: true } },
          publishers: { include: { publisher: true } },
        },
      });

      return updatedBook as Book;
    } catch (error) {
      return handleError(error);
    }
  },
  bookDelete: async (uuid: string, user_uuid: string) => {
    try {
      const userValidation = await validUser(user_uuid);
      if (userValidation && "error" in userValidation) {
        return { error: userValidation.error };
      }

      const book = await bookExists(uuid);
      if (book && "error" in book) {
        return { error: book.error };
      }
      await prisma.book.delete({
        where: { uuid: uuid },
      });

      return { message: "Book deleted successfully" };
    } catch (error) {
      return handleError(error);
    }
  },
};

export default bookService;
