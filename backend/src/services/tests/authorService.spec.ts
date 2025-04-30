import { PrismaClient } from "@prisma/client";
import { updateAuthors } from "../authorService";

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    bookAuthor: {
      deleteMany: jest.fn(),
      create: jest.fn() as jest.Mock,
    },
    author: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe("updateAuthors", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("não deve fazer nada se o array de autores não for fornecido", async () => {
    await updateAuthors(1);
    expect(prisma.bookAuthor.deleteMany).not.toHaveBeenCalled();
    expect(prisma.author.findFirst).not.toHaveBeenCalled();
    expect(prisma.author.create).not.toHaveBeenCalled();
    expect(prisma.bookAuthor.create).not.toHaveBeenCalled();
  });

  it("deve excluir autores existentes do livro e adicionar novos autores", async () => {
    (prisma.author.findFirst as jest.Mock).mockResolvedValueOnce(null);
    (prisma.author.create as jest.Mock).mockResolvedValueOnce({ id: 1 });
    (prisma.bookAuthor.create as jest.Mock).mockResolvedValueOnce({});

    await updateAuthors(1, ["Autor 1"]);

    expect(prisma.bookAuthor.deleteMany).toHaveBeenCalledWith({
      where: { book_id: 1 },
    });
    expect(prisma.author.findFirst).toHaveBeenCalledWith({
      where: { name: "Autor 1" },
    });
    expect(prisma.author.create).toHaveBeenCalledWith({
      data: {
        name: "Autor 1",
        bio: "",
        year_of_birth: expect.any(Date),
        image: expect.any(Buffer),
      },
    });
    expect(prisma.bookAuthor.create).toHaveBeenCalledWith({
      data: {
        author_id: 1,
        book_id: 1,
      },
    });
  });

  it("deve reutilizar autores existentes se eles já existirem", async () => {
    (prisma.author.findFirst as jest.Mock).mockResolvedValueOnce({ id: 2 });
    (prisma.bookAuthor.create as jest.Mock).mockResolvedValueOnce({});

    await updateAuthors(1, ["Autor Existente"]);

    expect(prisma.bookAuthor.deleteMany).toHaveBeenCalledWith({
      where: { book_id: 1 },
    });
    expect(prisma.author.findFirst).toHaveBeenCalledWith({
      where: { name: "Autor Existente" },
    });
    expect(prisma.author.create).not.toHaveBeenCalled();
    expect(prisma.bookAuthor.create).toHaveBeenCalledWith({
      data: {
        author_id: 2,
        book_id: 1,
      },
    });
  });
});
