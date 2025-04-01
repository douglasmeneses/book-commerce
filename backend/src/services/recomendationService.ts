import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const recomendationService = {
  registerBook: async (book_id: number, user_id: number) => {
    try {
      if (!book_id || !user_id)
        return { error: "Book ID and User ID are required" };

      prisma.recomendation.create({
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

      const livrosPorTitulo = await prisma.recomendation.findMany({
        where: {
          user_id: user_id,
        },
        include: {
          book: { include: { authors: true, genres: true, publishers: true } },
        },
      });

      //cart>>carItem>>Book

      const livrosPortitulo = [
        ...new Set(livrosPorTitulo.map((livro) => livro.book.title)),
      ];

      const livrosPorAutor = [
        ...new Set(livrosPorTitulo.map((livro) => livro.book.authors)),
      ];

      const livrosPorGenero = [
        ...new Set(livrosPorTitulo.map((livro) => livro.book.genres)),
      ];

      const livrosPorEditora = [
        ...new Set(livrosPorTitulo.map((livro) => livro.book.publishers)),
      ];
    } catch (error) {
      console.log(error);
      throw new Error("Error getting book recommendations");
    }
  },
};
