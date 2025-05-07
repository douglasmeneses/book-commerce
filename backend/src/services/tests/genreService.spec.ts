import { PrismaClient } from "@prisma/client";
import { updateGenres } from "../genreService";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    bookGenre: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    genre: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();
describe("updateGenres", () => {
  const mockDeleteMany = prisma.bookGenre.deleteMany as jest.Mock;
  const mockFindFirst = prisma.genre.findFirst as jest.Mock;
  const mockCreateGenre = prisma.genre.create as jest.Mock;
  const mockCreateBookGenre = prisma.bookGenre.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não deve fazer nada se genres for undefined", async () => {
    await updateGenres(1, undefined);

    expect(mockDeleteMany).not.toHaveBeenCalled();
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockCreateGenre).not.toHaveBeenCalled();
    expect(mockCreateBookGenre).not.toHaveBeenCalled();
  });

  it("deve excluir os gêneros existentes do livro e adicionar novos gêneros", async () => {
    mockFindFirst.mockResolvedValueOnce(null);
    mockCreateGenre.mockResolvedValueOnce({ id: 1, name: "Fantasy" });
    mockCreateBookGenre.mockResolvedValueOnce({});

    await updateGenres(1, ["Fantasy"]);

    expect(mockDeleteMany).toHaveBeenCalledWith({ where: { book_id: 1 } });
    expect(mockFindFirst).toHaveBeenCalledWith({ where: { name: "Fantasy" } });
    expect(mockCreateGenre).toHaveBeenCalledWith({ data: { name: "Fantasy" } });
    expect(mockCreateBookGenre).toHaveBeenCalledWith({
      data: { genre_id: 1, book_id: 1 },
    });
  });

  it("deve reutilizar gêneros existentes se eles já existirem", async () => {
    mockFindFirst.mockResolvedValueOnce({ id: 2, name: "Sci-Fi" });
    mockCreateBookGenre.mockResolvedValueOnce({});

    await updateGenres(2, ["Sci-Fi"]);

    expect(mockDeleteMany).toHaveBeenCalledWith({ where: { book_id: 2 } });
    expect(mockFindFirst).toHaveBeenCalledWith({ where: { name: "Sci-Fi" } });
    expect(mockCreateGenre).not.toHaveBeenCalled();
    expect(mockCreateBookGenre).toHaveBeenCalledWith({
      data: { genre_id: 2, book_id: 2 },
    });
  });

  it("deve lidar com múltiplos gêneros", async () => {
    mockFindFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 3, name: "Horror" });
    mockCreateGenre.mockResolvedValueOnce({ id: 4, name: "Adventure" });
    mockCreateBookGenre.mockResolvedValueOnce({});
    mockCreateBookGenre.mockResolvedValueOnce({});

    await updateGenres(3, ["Adventure", "Horror"]);

    expect(mockDeleteMany).toHaveBeenCalledWith({ where: { book_id: 3 } });
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { name: "Adventure" },
    });
    expect(mockFindFirst).toHaveBeenCalledWith({ where: { name: "Horror" } });
    expect(mockCreateGenre).toHaveBeenCalledWith({
      data: { name: "Adventure" },
    });
    expect(mockCreateBookGenre).toHaveBeenCalledWith({
      data: { genre_id: 4, book_id: 3 },
    });
    expect(mockCreateBookGenre).toHaveBeenCalledWith({
      data: { genre_id: 3, book_id: 3 },
    });
  });
});
