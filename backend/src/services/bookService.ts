import { RegisterBook, Filter, UpdateBook } from "../types/bookTypes";
import { Book, PrismaClient } from "@prisma/client";
import {
  bookExists,
  bookValidates,
  extractBookData,
  updateAuthors,
  updateGenres,
  updatePublishers,
} from "../middlewares/bookValidators";
import { userExists, validUser } from "../middlewares/userValidators";

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
    const { title, mostLiked, mostRecent, page, limit } = filter;
    const skip = page && limit ? (page - 1) * limit : 0;
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
        take: limit,
        skip: skip,
      });
      return books;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },
  getBookById: async (
    uuid: string,
    user_uuid?: string
  ): Promise<Book | object> => {
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
        where: {
          uuid: uuid,
        },
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
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
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
};

export default bookService;
