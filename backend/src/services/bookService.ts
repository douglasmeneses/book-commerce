import { RegisterBook, Filter } from "../types/bookTypes";
import { BookResponseDTO } from "../dtos/booksDTOs";
import { Book, PrismaClient } from "@prisma/client";
import userService from "./userService";
import validator from "validator";

const prisma = new PrismaClient();

const bookService = {
  bookRegister: async (
    book: RegisterBook,
    user_id: number
  ): Promise<Book | object> => {
    try {
      if (book.title.trim() === "" || !validator.isAscii(book.title)) {
        return { error: "Title is required" };
      }
      if (book.synopsis.trim() === "" || !validator.isAscii(book.synopsis)) {
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

      if (isNaN(user_id) || user_id <= 0 || !user_id) {
        return { error: "User ID is required" };
      }
      const user = await userService.getUserById(user_id);

      if (!user) {
        return { error: "User not found" };
      }

      if (user && user.isAdmin === false) {
        return { error: "invalid user" };
      }

      if (await prisma.book.findFirst({ where: { ISBN: book.ISBN } })) {
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

      return new BookResponseDTO(newBook);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },
  getBooks: async (filter: Filter) => {
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
      {
        error: error instanceof Error ? error.message : "An error occurred";
      }
    }
  },
  /**
   
  getBookById: async (){},
  bookUpdate: async (){},
  bookDelete: async (){},
  */
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
