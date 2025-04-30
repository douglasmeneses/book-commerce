import reviewController from "../reviewController";
import reviewService from "../../services/reviewService"; // importa o service pra usar no mock
import { mockRequest, mockResponse } from "./__utils__/index";

jest.mock("../../services/reviewService", () => ({
  __esModule: true,
  default: {
    createReview: jest.fn(),
    getReviews: jest.fn(),
    updateReview: jest.fn(),
    deleteReview: jest.fn(),
  },
}));

describe("reviewController.createReview", () => {
  it("deve criar uma resenha com sucesso", async () => {
    const req = mockRequest({
      params: { book_uuid: "book123" },
      body: { user_uuid: "user123", review: "Ótimo livro!", rating: 5 },
    });
    const res = mockResponse();

    (reviewService.createReview as jest.Mock).mockResolvedValue({
      id: 1,
      uuid: "review123",
      user_id: 1,
      book_id: 1,
      content: "Ótimo livro!",
      rating: 5,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await reviewController.createReview(req, res);

    expect(reviewService.createReview).toHaveBeenCalledWith(
      "book123",
      "user123",
      "Ótimo livro!",
      5
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        uuid: "review123",
        content: "Ótimo livro!",
        rating: 5,
      })
    );
  });

  it("deve lidar com erros ao criar uma resenha", async () => {
    const req = mockRequest({
      params: { book_uuid: "book123" },
      body: { user_uuid: "user123", review: "Ótimo livro!", rating: 5 },
    });
    const res = mockResponse();

    (reviewService.createReview as jest.Mock).mockResolvedValue({
      message: "Book not found",
      error: 404,
    });

    await reviewController.createReview(req, res);

    expect(reviewService.createReview).toHaveBeenCalledWith(
      "book123",
      "user123",
      "Ótimo livro!",
      5
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Book not found",
    });
  });

  it("deve lidar com erro interno", async () => {
    const req = mockRequest({
      params: { book_uuid: "book123" },
      body: { user_uuid: "user123", review: "Ótimo livro!", rating: 5 },
    });
    const res = mockResponse();

    (reviewService.createReview as jest.Mock).mockRejectedValue(
      new Error("An error occurred")
    );

    await reviewController.createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred",
    });
  });
});

describe("reviewController.getReviews", () => {
  it("deve pegar resenhas com sucesso", async () => {
    const req = mockRequest({
      params: { book_uuid: "book123" },
      query: { limit: "5", offset: "0", byRating: "4", orderBy: "asc" },
    });
    const res = mockResponse();

    (reviewService.getReviews as jest.Mock).mockResolvedValue([
      {
        id: 1,
        uuid: "review123",
        user_id: 1,
        book_id: 1,
        content: "Ótimo livro!",
        rating: 5,
        created_at: new Date(),
        updated_at: new Date(),
        user: {
          uuid: "user123",
          name: "João",
          username: "joao123",
          avatar: null,
        },
      },
    ]);

    await reviewController.getReviews(req, res);

    expect(reviewService.getReviews).toHaveBeenCalledWith("book123", {
      limit: 5,
      offset: 0,
      byRating: 4,
      orderBy: "asc",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 1,
        uuid: "review123",
        user_id: 1,
        book_id: 1,
        content: "Ótimo livro!",
        rating: 5,
        user: {
          uuid: "user123",
          name: "João",
          username: "joao123",
          avatar: null,
        },
      }),
    ]);
  });

  it("deve lidar com erros ao recuperar resenhas", async () => {
    const req = mockRequest({ params: { book_uuid: "book123" } });
    const res = mockResponse();

    (reviewService.getReviews as jest.Mock).mockResolvedValue({
      message: "not found",
      error: 404,
    } as unknown as Error);

    await reviewController.getReviews(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "not found",
    });
  });

  it("deve lidar com erro interno", async () => {
    const req = mockRequest({ params: { book_uuid: "book123" } });
    const res = mockResponse();

    (reviewService.getReviews as jest.Mock).mockRejectedValue(
      new Error("An error occurred")
    );

    await reviewController.getReviews(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred",
    });
  });
});

describe("reviewController.updateReview", () => {
  it("deve atualizar uma resenha com sucesso", async () => {
    const req = mockRequest({
      params: { review_uuid: "review123" },
      body: { review: "Resenha atualizada", rating: 4 },
    });
    const res = mockResponse();

    (reviewService.updateReview as jest.Mock).mockResolvedValue({
      message: "Resenha atualizada",
    });

    await reviewController.updateReview(req, res);

    expect(reviewService.updateReview).toHaveBeenCalledWith(
      "review123",
      "Resenha atualizada",
      4
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Resenha atualizada" });
  });

  it("deve lidar com erros ao atualizar uma resenha", async () => {
    const req = mockRequest({
      params: { review_uuid: "review123" },
      body: { review: "Resenha atualizada", rating: 4 },
    });
    const res = mockResponse();

    (reviewService.updateReview as jest.Mock).mockRejectedValue(
      new Error("Erro ao atualizar")
    );

    await reviewController.updateReview(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erro ao atualizar",
    });
  });
});

describe("reviewController.deleteReview", () => {
  it("deve deletar uma resenha com sucesso", async () => {
    const req = mockRequest({ params: { review_uuid: "review123" } });
    const res = mockResponse();

    (reviewService.deleteReview as jest.Mock).mockResolvedValue({
      message: "Resenha deletada",
    });

    await reviewController.deleteReview(req, res);

    expect(reviewService.deleteReview).toHaveBeenCalledWith("review123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Resenha deletada" });
  });

  it("deve lidar com erros ao deletar uma resenha", async () => {
    const req = mockRequest({ params: { review_uuid: "review123" } });
    const res = mockResponse();

    (reviewService.deleteReview as jest.Mock).mockRejectedValue(
      new Error("Erro ao deletar")
    );

    await reviewController.deleteReview(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erro ao deletar",
    });
  });
});
