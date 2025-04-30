import { PrismaClient } from "@prisma/client";
import bookService from ".././bookService";
import { bookExists } from "../../../src/middlewares/bookValidators";
import { extractBookData } from "../../../src/middlewares/bookValidators";
import { updateAuthors } from "../authorService";
import { updateGenres } from "../genreService";
import { updatePublishers } from "../publisherService";

jest.mock("@prisma/client", () => {
  const mPrisma = {
    book: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
    },
    favorites: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

jest.mock("../../../src/middlewares/bookValidators", () => ({
  bookValidates: jest.fn(),
  bookExists: jest.fn(),
  extractBookData: jest.fn(),
}));
jest.mock("../../../src/middlewares/userValidators", () => ({
  validUser: jest.fn(),
  userExists: jest.fn(),
}));

jest.mock("../authorService");
jest.mock("../genreService");
jest.mock("../publisherService");

import { bookValidates } from "../../../src/middlewares/bookValidators";
import { userExists, validUser } from "../../../src/middlewares/userValidators";
import { Filter } from "../../types/bookTypes";

describe("bookService.bookRegister", () => {
  const prisma = new PrismaClient();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro se a validação do livro falhar", async () => {
    (bookValidates as jest.Mock).mockResolvedValue({
      error: "Erro na validação",
    });

    const response = await bookService.bookRegister(
      {} as any,
      "fake-user-uuid"
    );

    expect(response).toEqual({ error: "Erro na validação" });
    expect(bookValidates).toHaveBeenCalled();
  });

  it("deve retornar erro se a validação do usuário falhar", async () => {
    (bookValidates as jest.Mock).mockResolvedValue(null);
    (validUser as jest.Mock).mockResolvedValue({ error: "Usuário inválido" });

    const response = await bookService.bookRegister(
      { title: "Book Title" } as any,
      "fake-user-uuid"
    );

    expect(response).toEqual({ error: "Usuário inválido" });
    expect(validUser).toHaveBeenCalled();
  });

  it("deve criar e retornar o livro se tudo estiver correto", async () => {
    const fakeBook = {
      id: 1,
      title: "Book Title",
      synopsis: "Some synopsis",
      language: "English",
      price: 10,
      ISBN: "1234567890",
      page_count: 100,
      stock_quantity: 10,
      release_date: new Date().toISOString(),
      authors: [],
      genres: [],
      publishers: [],
      image: null,
      image_url: null,
    };

    const fakeRegisterBook = {
      title: "Book Title",
      synopsis: "Some synopsis",
      language: "English",
      price: 10,
      ISBN: "1234567890",
      page_count: 100,
      stock_quantity: 10,
      release_date: new Date().toISOString(),
      authors: [],
      genres: [],
      publishers: [],
      image: undefined,
      image_url: undefined,
    };

    (bookValidates as jest.Mock).mockResolvedValue(null);
    (validUser as jest.Mock).mockResolvedValue(null);
    (prisma.book.create as jest.Mock).mockResolvedValue(fakeBook);

    const response = await bookService.bookRegister(
      fakeRegisterBook as any,
      "fake-user-uuid"
    );

    expect(response).toEqual(fakeBook);
    expect(prisma.book.create).toHaveBeenCalled();
  });
});

describe("bookService.getBooks", () => {
  const prisma = new PrismaClient();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro se o usuário não existir", async () => {
    (userExists as jest.Mock).mockResolvedValue({
      error: "Usuário não encontrado",
    });

    const response = await bookService.getBooks({}, "fake-user-uuid");

    expect(response).toEqual({ error: "Usuário não encontrado" });
    expect(userExists).toHaveBeenCalledWith("fake-user-uuid");
  });

  it("deve retornar a lista de livros corretamente", async () => {
    (userExists as jest.Mock).mockResolvedValue(null);

    const fakeBooks = [
      {
        id: 1,
        title: "Book One",
        synopsis: "Synopsis One",
        language: "English",
        price: 10,
        ISBN: "1111111111",
        page_count: 100,
        stock_quantity: 5,
        release_date: new Date().toISOString(),
        authors: [],
        genres: [],
        publishers: [],
        favorites: [],
        image: null,
        image_url: null,
      },
      {
        id: 2,
        title: "Book Two",
        synopsis: "Synopsis Two",
        language: "Portuguese",
        price: 20,
        ISBN: "2222222222",
        page_count: 200,
        stock_quantity: 8,
        release_date: new Date().toISOString(),
        authors: [],
        genres: [],
        publishers: [],
        favorites: [],
        image: null,
        image_url: null,
      },
    ];

    (prisma.book.findMany as jest.Mock).mockResolvedValue(fakeBooks);

    const filter: Filter = {
      search: "Book",
      page: 1,
      limit: 10,
    };

    const response = await bookService.getBooks(filter, "fake-user-uuid");

    if ("error" in response) {
      fail(
        "Expected response to be an array, but got an error: " + response.error
      );
    }

    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBe(2);
    expect(prisma.book.findMany).toHaveBeenCalled();
  });

  it("deve retornar erro se o prisma lançar erro", async () => {
    (userExists as jest.Mock).mockResolvedValue(null);
    (prisma.book.findMany as jest.Mock).mockRejectedValue(
      new Error("Erro no banco")
    );

    const response = await bookService.getBooks({}, "fake-user-uuid");

    expect(response).toEqual({ error: "Erro no banco" });
    expect(prisma.book.findMany).toHaveBeenCalled();
  });

  it("deve aplicar filtro por autor", async () => {
    (userExists as jest.Mock).mockResolvedValue(null);
    (prisma.book.findMany as jest.Mock).mockResolvedValue([]);

    const filter: Filter = {
      author: "Author Name",
      page: 1,
      limit: 5,
    };

    const response = await bookService.getBooks(filter, "fake-user-uuid");

    if ("error" in response) {
      fail(
        "Expected response to be an array, but got an error: " + response.error
      );
    }

    expect(Array.isArray(response)).toBe(true);
    expect(prisma.book.findMany).toHaveBeenCalled();
  });

  it("deve aplicar filtro por gênero", async () => {
    (userExists as jest.Mock).mockResolvedValue(null);
    (prisma.book.findMany as jest.Mock).mockResolvedValue([]);

    const filter: Filter = {
      genre: "Fantasy",
      page: 1,
      limit: 5,
    };

    const response = await bookService.getBooks(filter, "fake-user-uuid");

    if ("error" in response) {
      fail(
        "Expected response to be an array, but got an error: " + response.error
      );
    }

    expect(Array.isArray(response)).toBe(true);
    expect(prisma.book.findMany).toHaveBeenCalled();
  });

  it("deve aplicar filtro por editora", async () => {
    (userExists as jest.Mock).mockResolvedValue(null);
    (prisma.book.findMany as jest.Mock).mockResolvedValue([]);

    const filter: Filter = {
      publisher: "Editora ABC",
      page: 1,
      limit: 5,
    };

    const response = await bookService.getBooks(filter, "fake-user-uuid");

    if ("error" in response) {
      fail(
        "Expected response to be an array, but got an error: " + response.error
      );
    }

    expect(Array.isArray(response)).toBe(true);
    expect(prisma.book.findMany).toHaveBeenCalled();
  });

  it("deve ordenar por livros mais curtidos (mostLiked)", async () => {
    (userExists as jest.Mock).mockResolvedValue(null);
    (prisma.book.findMany as jest.Mock).mockResolvedValue([]);

    const filter: Filter = {
      mostLiked: true,
      page: 1,
      limit: 5,
    };

    const response = await bookService.getBooks(filter, "fake-user-uuid");

    if ("error" in response) {
      fail(
        "Expected response to be an array, but got an error: " + response.error
      );
    }

    expect(Array.isArray(response)).toBe(true);
    expect(prisma.book.findMany).toHaveBeenCalled();
  });

  it("deve ordenar por livros mais recentes (mostRecent)", async () => {
    (userExists as jest.Mock).mockResolvedValue(null);
    (prisma.book.findMany as jest.Mock).mockResolvedValue([]);

    const filter: Filter = {
      mostRecent: true,
      page: 1,
      limit: 5,
    };

    const response = await bookService.getBooks(filter, "fake-user-uuid");

    if ("error" in response) {
      fail(
        "Expected response to be an array, but got an error: " + response.error
      );
    }

    expect(Array.isArray(response)).toBe(true);
    expect(prisma.book.findMany).toHaveBeenCalled();
  });

  it("deve ordenar por preço (orderByPrice)", async () => {
    (userExists as jest.Mock).mockResolvedValue(null);
    (prisma.book.findMany as jest.Mock).mockResolvedValue([]);

    const filter: Filter = {
      orderByPrice: "asc",
      page: 1,
      limit: 5,
    };

    const response = await bookService.getBooks(filter, "fake-user-uuid");

    if ("error" in response) {
      fail(
        "Expected response to be an array, but got an error: " + response.error
      );
    }

    expect(Array.isArray(response)).toBe(true);
    expect(prisma.book.findMany).toHaveBeenCalled();
  });
});

describe("bookService.getBookById", () => {
  const prisma = new PrismaClient();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro se o ID for inválido", async () => {
    const response = await bookService.getBookById(null as any);

    expect(response).toEqual({ error: "Invalid ID" });
  });

  it("deve retornar erro se o livro não for encontrado", async () => {
    (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await bookService.getBookById(9999);

    expect(response).toEqual({ error: "Book not found" });
    expect(prisma.book.findUnique).toHaveBeenCalledWith({
      where: { id: 9999 },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } },
        publishers: { include: { publisher: true } },
      },
    });
  });

  it("deve retornar erro se o prisma lançar erro", async () => {
    (prisma.book.findUnique as jest.Mock).mockRejectedValue(
      new Error("Erro no banco")
    );

    const response = await bookService.getBookById(1);

    expect(response).toEqual({ error: "Erro no banco" });
    expect(prisma.book.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } },
        publishers: { include: { publisher: true } },
      },
    });
  });
});
describe("bookService.getBookByUUID", () => {
  const prisma = new PrismaClient();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro se o UUID for inválido", async () => {
    const response = await bookService.getBookByUUID(null as any);

    expect(response).toEqual({ error: "Invalid UUID" });
  });

  it("deve retornar erro se o user_uuid for inválido", async () => {
    const response = await bookService.getBookByUUID("valid-uuid", 123 as any);

    expect(response).toEqual({ error: "Invalid UUID" });
  });

  it("deve retornar erro se o usuário não existir", async () => {
    (userExists as jest.Mock).mockResolvedValue({
      error: "Usuário não encontrado",
    });

    const response = await bookService.getBookByUUID(
      "valid-uuid",
      "fake-user-uuid"
    );

    expect(response).toEqual({ error: "Usuário não encontrado" });
    expect(userExists).toHaveBeenCalledWith("fake-user-uuid");
  });

  it("deve retornar erro se o livro não for encontrado", async () => {
    (userExists as jest.Mock).mockResolvedValue(null);
    (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await bookService.getBookByUUID("valid-uuid");

    expect(response).toEqual({ error: "Book not found" });
    expect(prisma.book.findUnique).toHaveBeenCalledWith({
      where: { uuid: "valid-uuid" },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } },
        publishers: { include: { publisher: true } },
        favorites: undefined,
      },
    });
  });

  it("deve retornar o livro corretamente se encontrado", async () => {
    const fakeBook = {
      id: 1,
      uuid: "valid-uuid",
      title: "Book Title",
      authors: [],
      genres: [],
      publishers: [],
      favorites: [],
    };

    (userExists as jest.Mock).mockResolvedValue(null);
    (prisma.book.findUnique as jest.Mock).mockResolvedValue(fakeBook);

    const response = await bookService.getBookByUUID("valid-uuid");

    expect(response).toEqual(fakeBook);
    expect(prisma.book.findUnique).toHaveBeenCalledWith({
      where: { uuid: "valid-uuid" },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } },
        publishers: { include: { publisher: true } },
        favorites: undefined,
      },
    });
  });

  it("deve incluir favoritos se user_uuid for fornecido", async () => {
    const fakeUser = { id: 1 };
    const fakeBook = {
      id: 1,
      uuid: "valid-uuid",
      title: "Book Title",
      authors: [],
      genres: [],
      publishers: [],
      favorites: [{ user_id: 1 }],
    };

    (userExists as jest.Mock).mockResolvedValue(fakeUser);
    (prisma.book.findUnique as jest.Mock).mockResolvedValue(fakeBook);

    const response = await bookService.getBookByUUID(
      "valid-uuid",
      "fake-user-uuid"
    );

    expect(response).toEqual(fakeBook);
    expect(userExists).toHaveBeenCalledWith("fake-user-uuid");
    expect(prisma.book.findUnique).toHaveBeenCalledWith({
      where: { uuid: "valid-uuid" },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } },
        publishers: { include: { publisher: true } },
        favorites: { where: { user_id: fakeUser.id } },
      },
    });
  });

  it("deve retornar erro se o prisma lançar erro", async () => {
    (userExists as jest.Mock).mockResolvedValue(null);
    (prisma.book.findUnique as jest.Mock).mockRejectedValue(
      new Error("Erro no banco")
    );

    const response = await bookService.getBookByUUID("valid-uuid");

    expect(response).toEqual({
      error: "Erro no banco",
    });

    expect(prisma.book.findUnique).toHaveBeenCalledWith({
      where: { uuid: "valid-uuid" },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } },
        publishers: { include: { publisher: true } },
        favorites: undefined,
      },
    });
  });
});
describe("bookService.getBookByISBN", () => {
  const prisma = new PrismaClient();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar null se o livro não for encontrado", async () => {
    (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);

    const response = await bookService.getBookByISBN("non-existent-isbn");

    expect(response).toBeNull();
    expect(prisma.book.findFirst).toHaveBeenCalledWith({
      where: { ISBN: "non-existent-isbn" },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } },
        publishers: { include: { publisher: true } },
      },
    });
  });

  it("deve retornar o livro corretamente se encontrado", async () => {
    const fakeBook = {
      id: 1,
      ISBN: "1234567890",
      title: "Book Title",
      authors: [],
      genres: [],
      publishers: [],
    };

    (prisma.book.findFirst as jest.Mock).mockResolvedValue(fakeBook);

    const response = await bookService.getBookByISBN("1234567890");

    expect(response).toEqual(fakeBook);
    expect(prisma.book.findFirst).toHaveBeenCalledWith({
      where: { ISBN: "1234567890" },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } },
        publishers: { include: { publisher: true } },
      },
    });
  });

  it("deve retornar erro se o prisma lançar erro", async () => {
    (prisma.book.findFirst as jest.Mock).mockRejectedValue(
      new Error("Erro no banco")
    );

    await expect(bookService.getBookByISBN("1234567890")).rejects.toThrow(
      "Erro no banco"
    );

    expect(prisma.book.findFirst).toHaveBeenCalledWith({
      where: { ISBN: "1234567890" },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } },
        publishers: { include: { publisher: true } },
      },
    });
  });
});

describe("bookService.updateBook", () => {
  const prisma = new PrismaClient();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro se o usuário não for válido", async () => {
    (validUser as jest.Mock).mockResolvedValue({ error: "Usuário inválido" });

    const response = await bookService.updateBook(
      "book-uuid",
      "user-uuid",
      {} as any
    );

    expect(response).toEqual({ error: "Usuário inválido" });
    expect(validUser).toHaveBeenCalledWith("user-uuid");
  });

  it("deve retornar erro se o livro não existir", async () => {
    (validUser as jest.Mock).mockResolvedValue(null);
    (bookExists as jest.Mock).mockResolvedValue({
      error: "Livro não encontrado",
    });

    const response = await bookService.updateBook(
      "book-uuid",
      "user-uuid",
      {} as any
    );

    expect(response).toEqual({ error: "Livro não encontrado" });
    expect(bookExists).toHaveBeenCalledWith("book-uuid");
  });

  it("deve atualizar o livro corretamente", async () => {
    (validUser as jest.Mock).mockResolvedValue(null);
    (bookExists as jest.Mock).mockResolvedValue({ id: 1 });
    (extractBookData as jest.Mock).mockResolvedValue({
      title: "Updated Title",
    });
    (prisma.book.update as jest.Mock).mockResolvedValue(undefined);
    (updateAuthors as jest.Mock).mockResolvedValue(undefined);
    (updateGenres as jest.Mock).mockResolvedValue(undefined);
    (updatePublishers as jest.Mock).mockResolvedValue(undefined);

    const fakeUpdatedBook = {
      id: 1,
      title: "Updated Title",
      authors: [],
      genres: [],
      publishers: [],
    };

    (prisma.book.findUnique as jest.Mock).mockResolvedValue(fakeUpdatedBook);

    const response = await bookService.updateBook(
      "book-uuid",
      "user-uuid",
      {} as any
    );

    if ("error" in response) {
      fail("Expected a Book object but received an error: " + response.error);
    }

    expect(prisma.book.update).toHaveBeenCalledWith({
      where: { uuid: "book-uuid" },
      data: { title: "Updated Title" },
    });

    expect(updateAuthors).toHaveBeenCalledWith(1, undefined);
    expect(updateGenres).toHaveBeenCalledWith(1, undefined);
    expect(updatePublishers).toHaveBeenCalledWith(1, undefined);

    expect(response).toEqual(fakeUpdatedBook);
  });

  it("deve retornar erro se alguma exceção ocorrer", async () => {
    (validUser as jest.Mock).mockResolvedValue(null);
    (bookExists as jest.Mock).mockResolvedValue({ id: 1 });
    (extractBookData as jest.Mock).mockRejectedValue(
      new Error("Erro inesperado")
    );

    const response = await bookService.updateBook(
      "book-uuid",
      "user-uuid",
      {} as any
    );

    expect(response).toEqual({ error: "Erro inesperado" });
  });
});

describe("bookService.bookDelete", () => {
  const prisma = new PrismaClient();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro se o usuário não for válido", async () => {
    (validUser as jest.Mock).mockResolvedValue({ error: "Usuário inválido" });

    const response = await bookService.bookDelete("book-uuid", "user-uuid");

    expect(response).toEqual({ error: "Usuário inválido" });
    expect(validUser).toHaveBeenCalledWith("user-uuid");
  });

  it("deve retornar erro se o livro não existir", async () => {
    (validUser as jest.Mock).mockResolvedValue(null);
    (bookExists as jest.Mock).mockResolvedValue({
      error: "Livro não encontrado",
    });

    const response = await bookService.bookDelete("book-uuid", "user-uuid");

    expect(response).toEqual({ error: "Livro não encontrado" });
    expect(bookExists).toHaveBeenCalledWith("book-uuid");
  });

  it("deve deletar o livro com sucesso", async () => {
    (validUser as jest.Mock).mockResolvedValue(null);
    (bookExists as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.book.delete as jest.Mock).mockResolvedValue(undefined);

    const response = await bookService.bookDelete("book-uuid", "user-uuid");

    expect(prisma.book.delete).toHaveBeenCalledWith({
      where: { uuid: "book-uuid" },
    });

    expect(response).toEqual({ message: "Book deleted successfully" });
  });

  it("deve retornar erro se alguma exceção ocorrer", async () => {
    (validUser as jest.Mock).mockResolvedValue(null);
    (bookExists as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.book.delete as jest.Mock).mockRejectedValue(
      new Error("Erro inesperado")
    );

    const response = await bookService.bookDelete("book-uuid", "user-uuid");

    expect(response).toEqual({ error: "Erro inesperado" });
  });
});

describe("bookService.bookFavorite", () => {
  const prisma = new PrismaClient();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro se o livro não existir", async () => {
    (bookExists as jest.Mock).mockResolvedValue({
      error: "Livro não encontrado",
    });

    const response = await bookService.bookFavorite("book-uuid", "user-uuid");

    expect(response).toEqual({ error: "Livro não encontrado" });
    expect(bookExists).toHaveBeenCalledWith("book-uuid");
  });

  it("deve retornar erro se o usuário não existir", async () => {
    (bookExists as jest.Mock).mockResolvedValue({ id: 1 });
    (userExists as jest.Mock).mockResolvedValue({
      error: "Usuário não encontrado",
    });

    const response = await bookService.bookFavorite("book-uuid", "user-uuid");

    expect(response).toEqual({ error: "Usuário não encontrado" });
    expect(userExists).toHaveBeenCalledWith("user-uuid");
  });

  it("deve decrementar o favorite_count se o livro não está favoritado", async () => {
    (bookExists as jest.Mock).mockResolvedValue({ id: 1, favorite_count: 5 });
    (userExists as jest.Mock).mockResolvedValue({ id: 10 });
    (prisma.favorites.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.book.update as jest.Mock).mockResolvedValue(undefined);

    const response = await bookService.bookFavorite("book-uuid", "user-uuid");

    expect(prisma.book.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { favorite_count: 4 },
    });

    expect(response).toBeUndefined();
  });

  it("deve incrementar o favorite_count se o livro já está favoritado", async () => {
    (bookExists as jest.Mock).mockResolvedValue({ id: 1, favorite_count: 5 });
    (userExists as jest.Mock).mockResolvedValue({ id: 10 });
    (prisma.favorites.findFirst as jest.Mock).mockResolvedValue({ id: 100 });
    (prisma.book.update as jest.Mock).mockResolvedValue(undefined);

    const response = await bookService.bookFavorite("book-uuid", "user-uuid");

    expect(prisma.book.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { favorite_count: 6 },
    });

    expect(response).toBeUndefined();
  });

  it("deve retornar erro se ocorrer uma exceção", async () => {
    (bookExists as jest.Mock).mockRejectedValue(new Error("Erro inesperado"));
    const response = await bookService.bookFavorite("book-uuid", "user-uuid");
    expect(response).toEqual({ error: "Erro inesperado" });
  });
});
