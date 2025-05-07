import { PrismaClient } from "@prisma/client";
import bookService from "./bookService";
import { removePrepositionsAndArticles } from "../utils/recomendationsUtils";
import userService from "./userService";

const prisma = new PrismaClient();

const recomendationService = {
  registerBookForRecomendations: async (book_id: number, user_id: number) => {
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
  getBookRecommendations: async (user_uuid: string) => {
    try {
      if (!user_uuid) return { error: "User ID is required" };

      const user = await userService.getUserByUUID(user_uuid);
      if (!user) return { error: "User not found" };

      const books = await prisma.recomendation.findMany({
        where: { user_id: user.id },
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
        bookTitles.map((title: string) => bookService.getBooks({ title }))
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
        .filter((book) => book && "uuid" in book);

      let booksResults = Array.from(
        new Map(allBooks.map((book) => [book.uuid, book])).values()
      );

      booksResults = booksResults
        .filter(
          (book) =>
            !books.some((livro) => livro.book.uuid === book.uuid) &&
            book.uuid !== user_uuid
        )
        .slice(0, 10);

      return booksResults;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting book recommendations");
    }
  },
};

export default recomendationService;
