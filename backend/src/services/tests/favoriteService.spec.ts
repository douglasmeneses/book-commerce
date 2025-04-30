import favoriteService from "../favoriteService";
import bookService from "../bookService";
import { PrismaClient } from "@prisma/client";
import { bookExists } from "../../middlewares/bookValidators";
import { userExists } from "../../middlewares/userValidators";

jest.mock("../../middlewares/bookValidators", () => ({
  bookExists: jest.fn(),
}));
jest.mock("../../middlewares/userValidators", () => ({
  userExists: jest.fn(),
}));
jest.mock("../bookService", () => ({
  bookFavorite: jest.fn(),
}));

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    favorites: {
      create: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
  };
});

const prisma = new PrismaClient();

describe("favoriteService.favoriteBook", () => {
  it("deve retornar um erro se o usuário não existir", async () => {
    (userExists as jest.Mock).mockResolvedValue({ error: "User not found" });

    const result = await favoriteService.favoriteBook("book-uuid", "user-uuid");

    expect(result).toEqual({ error: "User not found" });
    expect(userExists).toHaveBeenCalledWith("user-uuid");
    expect(bookExists).not.toHaveBeenCalled();
    expect(prisma.favorites.findFirst).not.toHaveBeenCalled();
  });

  it("deve retornar um erro se o livro não existir", async () => {
    (userExists as jest.Mock).mockResolvedValue({ id: 1 });
    (bookExists as jest.Mock).mockResolvedValue({ error: "Book not found" });

    const result = await favoriteService.favoriteBook("book-uuid", "user-uuid");

    expect(result).toEqual({ error: "Book not found" });
    expect(userExists).toHaveBeenCalledWith("user-uuid");
    expect(bookExists).toHaveBeenCalledWith("book-uuid");
    expect(prisma.favorites.findFirst).not.toHaveBeenCalled();
  });

  it("deve criar um favorito se ele não existir", async () => {
    (userExists as jest.Mock).mockResolvedValue({ id: 1 });
    (bookExists as jest.Mock).mockResolvedValue({ id: 2 });
    (prisma.favorites.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.favorites.create as jest.Mock).mockResolvedValue({ id: 3 });

    const result = await favoriteService.favoriteBook("book-uuid", "user-uuid");

    expect(result).toEqual({ id: 3 });
    expect(prisma.favorites.create).toHaveBeenCalledWith({
      data: { book_id: 2, user_id: 1 },
    });
    expect(bookService.bookFavorite).toHaveBeenCalledWith(
      "book-uuid",
      "user-uuid"
    );
  });

  it("deve excluir um favorito se ele já existir", async () => {
    (userExists as jest.Mock).mockResolvedValue({ id: 1 });
    (bookExists as jest.Mock).mockResolvedValue({ id: 2 });
    (prisma.favorites.findFirst as jest.Mock).mockResolvedValue({ id: 3 });
    (prisma.favorites.delete as jest.Mock).mockResolvedValue(null);

    const result = await favoriteService.favoriteBook("book-uuid", "user-uuid");

    expect(result).toBeNull();
    expect(prisma.favorites.delete).toHaveBeenCalledWith({
      where: { user_id_book_id: { user_id: 1, book_id: 2 } },
    });
    expect(bookService.bookFavorite).toHaveBeenCalledWith(
      "book-uuid",
      "user-uuid"
    );
  });

  it("deve retornar um erro se ocorrer uma exceção", async () => {
    (userExists as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    const result = await favoriteService.favoriteBook("book-uuid", "user-uuid");

    expect(result).toEqual({ error: "Unexpected error" });
  });
});
describe("favoriteService.getFavorites", () => {
  describe("favoriteService.getFavorites", () => {
    it("deve retornar um erro se o usuário não existir", async () => {
      (userExists as jest.Mock).mockResolvedValue({ error: "User not found" });

      const result = await favoriteService.getFavorites("user-uuid");

      expect(result).toEqual({ error: "User not found" });
      expect(userExists).toHaveBeenCalledWith("user-uuid");
      expect(prisma.favorites.findMany).not.toHaveBeenCalled();
    });

    it("deve retornar uma lista de favoritos para um usuário válido", async () => {
      (userExists as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.favorites.findMany as jest.Mock).mockResolvedValue([
        {
          id: 1,
          book: {
            id: 2,
            title: "Book Title",
            authors: [{ author: { id: 1, name: "Author Name" } }],
            genres: [{ genre: { id: 1, name: "Genre Name" } }],
            publishers: [{ publisher: { id: 1, name: "Publisher Name" } }],
            favorites: [{ user_id: 1 }],
          },
        },
      ]);

      const result = await favoriteService.getFavorites("user-uuid");

      expect(result).toEqual([
        {
          id: 1,
          book: {
            id: 2,
            title: "Book Title",
            authors: [{ author: { id: 1, name: "Author Name" } }],
            genres: [{ genre: { id: 1, name: "Genre Name" } }],
            publishers: [{ publisher: { id: 1, name: "Publisher Name" } }],
            favorites: [{ user_id: 1 }],
          },
        },
      ]);
      expect(userExists).toHaveBeenCalledWith("user-uuid");
      expect(prisma.favorites.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 },
        include: {
          book: {
            include: {
              authors: { include: { author: true } },
              genres: { include: { genre: true } },
              publishers: { include: { publisher: true } },
              favorites: { where: { user_id: 1 } },
            },
          },
        },
        orderBy: { created_at: "desc" },
      });
    });

    it("deve retornar um erro se ocorrer uma exceção", async () => {
      (userExists as jest.Mock).mockRejectedValue(
        new Error("Unexpected error")
      );

      const result = await favoriteService.getFavorites("user-uuid");

      expect(result).toEqual({ error: "Unexpected error" });
    });
  });
});
