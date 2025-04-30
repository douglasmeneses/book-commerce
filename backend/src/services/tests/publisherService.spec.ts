import { PrismaClient } from "@prisma/client";
import { updatePublishers } from "../publisherService";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    bookPublisher: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    publisher: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();
describe("updatePublishers", () => {
  const mockDeleteMany = prisma.bookPublisher.deleteMany as jest.Mock;
  const mockFindFirst = prisma.publisher.findFirst as jest.Mock;
  const mockCreatePublisher = prisma.publisher.create as jest.Mock;
  const mockCreateBookPublisher = prisma.bookPublisher.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não deve fazer nada se publishers for undefined", async () => {
    await updatePublishers(1, undefined);

    expect(mockDeleteMany).not.toHaveBeenCalled();
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockCreatePublisher).not.toHaveBeenCalled();
    expect(mockCreateBookPublisher).not.toHaveBeenCalled();
  });

  it("deve excluir os publishers existentes do livro e adicionar novos publishers", async () => {
    mockFindFirst.mockResolvedValueOnce(null);
    mockCreatePublisher.mockResolvedValueOnce({ id: 1, name: "Penguin" });
    mockCreateBookPublisher.mockResolvedValueOnce({});

    await updatePublishers(1, ["Penguin"]);

    expect(mockDeleteMany).toHaveBeenCalledWith({ where: { book_id: 1 } });
    expect(mockFindFirst).toHaveBeenCalledWith({ where: { name: "Penguin" } });
    expect(mockCreatePublisher).toHaveBeenCalledWith({
      data: { name: "Penguin" },
    });
    expect(mockCreateBookPublisher).toHaveBeenCalledWith({
      data: { publisher_id: 1, book_id: 1 },
    });
  });

  it("deve reutilizar publishers existentes se eles já existirem", async () => {
    mockFindFirst.mockResolvedValueOnce({ id: 2, name: "HarperCollins" });
    mockCreateBookPublisher.mockResolvedValueOnce({});

    await updatePublishers(2, ["HarperCollins"]);

    expect(mockDeleteMany).toHaveBeenCalledWith({ where: { book_id: 2 } });
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { name: "HarperCollins" },
    });
    expect(mockCreatePublisher).not.toHaveBeenCalled();
    expect(mockCreateBookPublisher).toHaveBeenCalledWith({
      data: { publisher_id: 2, book_id: 2 },
    });
  });

  it("deve lidar com múltiplos publishers", async () => {
    mockFindFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 3, name: "Macmillan" });
    mockCreatePublisher.mockResolvedValueOnce({ id: 4, name: "Random House" });
    mockCreateBookPublisher.mockResolvedValueOnce({});
    mockCreateBookPublisher.mockResolvedValueOnce({});

    await updatePublishers(3, ["Random House", "Macmillan"]);

    expect(mockDeleteMany).toHaveBeenCalledWith({ where: { book_id: 3 } });
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { name: "Random House" },
    });
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { name: "Macmillan" },
    });
    expect(mockCreatePublisher).toHaveBeenCalledWith({
      data: { name: "Random House" },
    });
    expect(mockCreateBookPublisher).toHaveBeenCalledWith({
      data: { publisher_id: 4, book_id: 3 },
    });
    expect(mockCreateBookPublisher).toHaveBeenCalledWith({
      data: { publisher_id: 3, book_id: 3 },
    });
  });
});
