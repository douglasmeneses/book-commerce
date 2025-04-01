import { Book, PrismaClient } from "@prisma/client";
import bookService from "./bookService";
import { removePrepositionsAndArticles } from "../utils/recomendationsUtils";

const prisma = new PrismaClient();

const recomendationService = {
  registerBook: async (book_id: number, user_id: number) => {
    try {
      if (!book_id || !user_id)
        return { error: "Book ID and User ID are required" };

      await prisma.recomendation.create({
        data: {
          book_id: book_id,
          user_id: user_id,
        },
      });

      return { message: "Book registered successfully" };
    } catch (error) {
      console.log(error);
      throw new Error("Error registering book");
    }
  },
  getBookRecommendations: async (user_id: number) => {
    try {
      if (!user_id) return { error: "User ID is required" };

      const books = await prisma.recomendation.findMany({
        where: { user_id },
        include: {
          book: {
            include: {
              authors: { include: { author: true } },
              genres: { include: { genre: true } },
              publishers: { include: { publisher: true } },
            },
          },
        },
      });

      const bookTitles = removePrepositionsAndArticles(
        books.map((livro) => livro.book.title)
      );

      const bookAuthors = Array.from(
        new Set(
          books.flatMap((livro) => livro.book.authors.map((a) => a.author.name))
        )
      );

      const bookGenres = Array.from(
        new Set(
          books.flatMap((livro) => livro.book.genres.map((g) => g.genre.name))
        )
      );

      const bookPublishers = Array.from(
        new Set(
          books.flatMap((livro) =>
            livro.book.publishers.map((p) => p.publisher.name)
          )
        )
      );

      const booksArray1 = await Promise.all(
        bookTitles.map((title) => bookService.getBooks({ title }))
      );

      const booksArray2 = await Promise.all(
        bookAuthors.map((author) => bookService.getBooks({ author }))
      );

      const booksArray3 = await Promise.all(
        bookGenres.map((genre) => bookService.getBooks({ genre }))
      );

      const booksArray4 = await Promise.all(
        bookPublishers.map((publisher) => bookService.getBooks({ publisher }))
      );

      const allBooks = [
        ...booksArray1,
        ...booksArray2,
        ...booksArray3,
        ...booksArray4,
      ]
        .flat()
        .filter((book) => book && "id" in book);

      const booksResults = Array.from(
        new Map(allBooks.map((book) => [book.id, book])).values()
      );

      return booksResults;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting book recommendations");
    }
  },
};

export default recomendationService;
