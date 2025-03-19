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
import { get } from "http";

const prisma = new PrismaClient();

const bookService = {
  bookRegister: async (
    book: RegisterBook,
    user_uuid: string
  ): Promise<Book | object> => {
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
          image: book.image || null,
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
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },
  getBooks: async (filter: Filter): Promise<Book[] | object> => {
    const {
      search,
      author,
      genre,
      publisher,
      isbn,
      mostLiked,
      mostRecent,
      orderByPrice,
      minPrice,
      maxPrice,
      page,
      limit,
    } = filter;

    const skip = page && limit ? (page - 1) * limit : 0;

    const where: any = {
      title: search ? { contains: search, mode: "insensitive" } : undefined,
      ISBN: isbn ? { contains: isbn, mode: "insensitive" } : undefined,
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    };

    if (author) {
      where.authors = {
        some: { author: { name: { contains: author, mode: "insensitive" } } },
      };
    }

    if (genre) {
      where.genres = {
        some: { genre: { name: { contains: genre, mode: "insensitive" } } },
      };
    }

    if (publisher) {
      where.publishers = {
        some: {
          publisher: { name: { contains: publisher, mode: "insensitive" } },
        },
      };
    }

    const orderBy: any[] = [];
    if (mostLiked) orderBy.push({ favorite_count: "desc" });
    if (mostRecent) orderBy.push({ created_at: "desc" });
    if (orderByPrice) orderBy.push({ price: orderByPrice });

    try {
      return await prisma.book.findMany({
        where,
        orderBy,
        include: {
          authors: { include: { author: true } },
          genres: { include: { genre: true } },
          publishers: { include: { publisher: true } },
        },
        take: limit,
        skip,
      });
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
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
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
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
  ): Promise<Book | object> => {
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
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
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
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },
  bookFavorite: async (uuid: string, user_uuid: string) => {
    try {
      const book = await bookExists(uuid);
      if (book && "error" in book) {
        return { error: book.error };
      }
      const user = await userExists(user_uuid);
      if (user && "error" in user) {
        return { error: user.error };
      }

      const favorite = await prisma.favorites.findFirst({
        where: { user_id: user.id, book_id: book.id },
      });

      if (!favorite) {
        await prisma.book.update({
          where: { id: book.id },
          data: { favorite_count: book.favorite_count - 1 },
        });
      } else {
        await prisma.book.update({
          where: { id: book.id },
          data: { favorite_count: book.favorite_count + 1 },
        });
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },

  searchBook: async (search: string) => {
    try {
      const searchResult = await prisma.book.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { synopsis: { contains: search, mode: "insensitive" } },
            { ISBN: { contains: search, mode: "insensitive" } },
            { language: { contains: search, mode: "insensitive" } },
            {
              authors: {
                some: {
                  author: { name: { contains: search, mode: "insensitive" } },
                },
              },
            },
            {
              genres: {
                some: {
                  genre: { name: { contains: search, mode: "insensitive" } },
                },
              },
            },
            {
              publishers: {
                some: {
                  publisher: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              },
            },
          ],
        },
        include: {
          authors: { include: { author: true } },
          genres: { include: { genre: true } },
          publishers: { include: { publisher: true } },
        },
      });

      return searchResult;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },
};

export default bookService;
