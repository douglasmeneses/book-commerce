import { PrismaClient } from "@prisma/client";
import reviewService from "../reviewService";
import { averageRating, validateReviewFields } from "../../utils/reviewUtils";
import { CreateReview, ReviewWithUser } from "../../types/reviewTypes";

jest.mock("../../utils/reviewUtils", () => ({
  validateReviewFields: jest.fn(),
  averageRating: jest.fn(),
}));

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    review: {
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    book: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe("reviewService.createReview", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro de validação se os campos forem inválidos", async () => {
    (validateReviewFields as jest.Mock).mockReturnValue({
      message: "Invalid fields",
      error: 400,
    });

    const response = await reviewService.createReview(
      "book-uuid",
      "user-uuid",
      "",
      0
    );

    expect(validateReviewFields).toHaveBeenCalledWith({
      review: "",
      rating: 0,
    });
    expect(response).toEqual({ message: "Invalid fields", error: 400 });
  });

  it("deve retornar erro se o livro não for encontrado", async () => {
    (validateReviewFields as jest.Mock).mockReturnValue(null);
    (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);

    const response = await reviewService.createReview(
      "book-uuid",
      "user-uuid",
      "Great book!",
      5
    );

    expect(prisma.book.findFirst).toHaveBeenCalledWith({
      where: { uuid: "book-uuid" },
    });
    expect(response).toEqual({ message: "Book not found", error: 404 });
  });

  it("deve retornar erro se o usuário não for encontrado", async () => {
    (validateReviewFields as jest.Mock).mockReturnValue(null);
    (prisma.book.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    const response = await reviewService.createReview(
      "book-uuid",
      "user-uuid",
      "Great book!",
      5
    );

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { uuid: "user-uuid" },
    });
    expect(response).toEqual({ message: "User not found", error: 404 });
  });

  it("deve retornar erro se o usuário já tiver avaliado o livro", async () => {
    (validateReviewFields as jest.Mock).mockReturnValue(null);
    (prisma.book.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.review.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

    const response = await reviewService.createReview(
      "book-uuid",
      "user-uuid",
      "Great book!",
      5
    );

    expect(prisma.review.findFirst).toHaveBeenCalledWith({
      where: { book_id: 1, user_id: 1 },
    });
    expect(response).toEqual({
      message: "You have already reviewed this book",
      error: 400,
    });
  });

  it("deve criar uma resenha com sucesso", async () => {
    (validateReviewFields as jest.Mock).mockReturnValue(null);
    (prisma.book.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.review.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.review.create as jest.Mock).mockResolvedValue({
      id: 1,
      content: "Great book!",
      rating: 5,
    });

    const response = await reviewService.createReview(
      "book-uuid",
      "user-uuid",
      "Great book!",
      5
    );

    expect(prisma.review.create).toHaveBeenCalledWith({
      data: {
        user_id: 1,
        book_id: 1,
        content: "Great book!",
        rating: 5,
      },
    });
    expect(response).toEqual({
      message: "Review created successfully",
      data: {
        id: 1,
        content: "Great book!",
        rating: 5,
      },
    });
  });

  it("deve retornar erro interno se ocorrer uma exceção", async () => {
    (validateReviewFields as jest.Mock).mockReturnValue(null);
    (prisma.book.findFirst as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await reviewService.createReview(
      "book-uuid",
      "user-uuid",
      "Great book!",
      5
    );

    expect(response).toEqual({
      message: "Database error",
      error: 500,
    });
  });
});
describe("reviewService.getReviews", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro se o livro não for encontrado", async () => {
    (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);

    const response = await reviewService.getReviews("book-uuid", {
      limit: 10,
      offset: 0,
      orderBy: "asc",
    });

    expect(prisma.book.findFirst).toHaveBeenCalledWith({
      where: { uuid: "book-uuid" },
    });
    expect(response).toEqual({ message: "Book not found", error: 404 });
  });

  it("deve retornar erro se nenhuma resenha for encontrada", async () => {
    (prisma.book.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.review.findMany as jest.Mock).mockResolvedValue([]);

    const response = await reviewService.getReviews("book-uuid", {
      limit: 10,
      offset: 0,
      orderBy: "asc",
    });

    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where: {
        book: { uuid: "book-uuid" },
      },
      orderBy: { created_at: "asc" },
      skip: 0,
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            uuid: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    expect(response).toEqual({ message: "No reviews found", error: 404 });
  });

  it("deve retornar as resenhas com sucesso", async () => {
    (prisma.book.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.review.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        content: "Great book!",
        rating: 5,
        user: {
          id: 1,
          uuid: "user-uuid",
          name: "John Doe",
          username: "johndoe",
          avatar: "avatar-url",
        },
      },
    ]);

    const response = await reviewService.getReviews("book-uuid", {
      limit: 10,
      offset: 0,
      orderBy: "asc",
    });

    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where: {
        book: { uuid: "book-uuid" },
      },
      orderBy: { created_at: "asc" },
      skip: 0,
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            uuid: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    expect(response).toEqual([
      {
        id: 1,
        content: "Great book!",
        rating: 5,
        user: {
          id: 1,
          uuid: "user-uuid",
          name: "John Doe",
          username: "johndoe",
          avatar: "avatar-url",
        },
      },
    ]);
  });

  it("deve filtrar resenhas por classificação", async () => {
    (prisma.book.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.review.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        content: "Great book!",
        rating: 5,
        user: {
          id: 1,
          uuid: "user-uuid",
          name: "John Doe",
          username: "johndoe",
          avatar: "avatar-url",
        },
      },
    ]);

    const response = await reviewService.getReviews("book-uuid", {
      limit: 10,
      offset: 0,
      byRating: 5,
      orderBy: "asc",
    });

    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where: {
        book: { uuid: "book-uuid" },
        rating: 5,
      },
      orderBy: { created_at: "asc" },
      skip: 0,
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            uuid: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    expect(response).toEqual([
      {
        id: 1,
        content: "Great book!",
        rating: 5,
        user: {
          id: 1,
          uuid: "user-uuid",
          name: "John Doe",
          username: "johndoe",
          avatar: "avatar-url",
        },
      },
    ]);
  });

  it("deve retornar erro interno se ocorrer uma exceção", async () => {
    (prisma.book.findFirst as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await reviewService.getReviews("book-uuid", {
      limit: 10,
      offset: 0,
      orderBy: "asc",
    });

    expect(response).toEqual({
      message: "Database error",
      error: 500,
    });
  });
});
describe("reviewService.updateReview", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro de validação se os campos forem inválidos", async () => {
    (validateReviewFields as jest.Mock).mockReturnValue({
      message: "Invalid fields",
      error: 400,
    });

    const response = await reviewService.updateReview("review-uuid", "", 0);

    expect(validateReviewFields).toHaveBeenCalledWith({
      review: "",
      rating: 0,
    });
    expect(response).toEqual({ message: "Invalid fields", error: 400 });
  });

  it("deve retornar erro se a resenha não for encontrada", async () => {
    (validateReviewFields as jest.Mock).mockReturnValue(null);
    (prisma.review.findFirst as jest.Mock).mockResolvedValue(null);

    const response = await reviewService.updateReview(
      "review-uuid",
      "Updated review",
      4
    );

    expect(prisma.review.findFirst).toHaveBeenCalledWith({
      where: { uuid: "review-uuid" },
    });
    expect(response).toEqual({ message: "Review not found", error: 404 });
  });

  it("deve atualizar a resenha com sucesso", async () => {
    (validateReviewFields as jest.Mock).mockReturnValue(null);
    (prisma.review.findFirst as jest.Mock).mockResolvedValue({
      id: 1,
      book_id: 1,
    });
    (prisma.review.update as jest.Mock).mockResolvedValue({
      id: 1,
      content: "Updated review",
      rating: 4,
    });

    const response = await reviewService.updateReview(
      "review-uuid",
      "Updated review",
      4
    );

    expect(prisma.review.update).toHaveBeenCalledWith({
      where: { uuid: "review-uuid" },
      data: { content: "Updated review", rating: 4 },
    });
    expect(response).toEqual({ message: "Review updated successfully" });
  });

  it("deve retornar erro interno se ocorrer uma exceção", async () => {
    (validateReviewFields as jest.Mock).mockReturnValue(null);
    (prisma.review.findFirst as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await reviewService.updateReview(
      "review-uuid",
      "Updated review",
      4
    );

    expect(response).toEqual({
      message: "Database error",
      error: 500,
    });
  });
});
describe("reviewService.deleteReview", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro se a resenha não for encontrada", async () => {
    (prisma.review.findFirst as jest.Mock).mockResolvedValue(null);

    const response = await reviewService.deleteReview("review-uuid");

    expect(prisma.review.findFirst).toHaveBeenCalledWith({
      where: { uuid: "review-uuid" },
    });
    expect(response).toEqual({ message: "Review not found", error: 404 });
  });

  it("deve deletar a resenha com sucesso", async () => {
    (prisma.review.findFirst as jest.Mock).mockResolvedValue({
      id: 1,
      book_id: 1,
    });
    (prisma.review.delete as jest.Mock).mockResolvedValue({});

    const response = await reviewService.deleteReview("review-uuid");

    expect(prisma.review.delete).toHaveBeenCalledWith({
      where: { uuid: "review-uuid" },
    });
    expect(response).toEqual({ message: "Review deleted successfully" });
  });

  it("deve retornar erro interno se ocorrer uma exceção", async () => {
    (prisma.review.findFirst as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await reviewService.deleteReview("review-uuid");

    expect(response).toEqual({
      message: "Database error",
      error: 500,
    });
  });
});
