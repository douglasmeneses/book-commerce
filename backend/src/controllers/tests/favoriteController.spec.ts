import favoriteController from "../../controllers/favoriteController";
import favoriteService from "../../services/favoriteService";
import { mockRequest, mockResponse } from "./__utils__/index";

jest.mock("../../services/favoriteService", () => ({
  __esModule: true,
  default: {
    favoriteBook: jest.fn(),
    getFavorites: jest.fn(),
  },
}));

describe("favoriteController.favoriteBook", () => {
  it("deve favoritar um livro com sucesso", async () => {
    const req = mockRequest({
      params: {
        book_uuid: "book123",
      },
      body: {
        user_uuid: "user456",
      },
    });
    const res = mockResponse();

    (favoriteService.favoriteBook as jest.Mock).mockResolvedValue(true);

    await favoriteController.favoriteBook(req, res);

    expect(favoriteService.favoriteBook).toHaveBeenCalledWith(
      "book123",
      "user456"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Book favorited" });
  });

  it("deve desfavoritar um livro com sucesso", async () => {
    const req = mockRequest({
      params: {
        book_uuid: "book123",
      },
      body: {
        user_uuid: "user456",
      },
    });
    const res = mockResponse();

    (favoriteService.favoriteBook as jest.Mock).mockResolvedValue(false);

    await favoriteController.favoriteBook(req, res);

    expect(favoriteService.favoriteBook).toHaveBeenCalledWith(
      "book123",
      "user456"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Book unfavorited" });
  });

  it("deve retornar erro 404 se o serviço retornar erro", async () => {
    const req = mockRequest({
      params: {
        book_uuid: "book123",
      },
      body: {
        user_uuid: "user456",
      },
    });
    const res = mockResponse();

    (favoriteService.favoriteBook as jest.Mock).mockResolvedValue({
      error: "Livro não encontrado",
    });

    await favoriteController.favoriteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Livro não encontrado" });
  });

  it("deve tratar exceções e retornar 500", async () => {
    const req = mockRequest({
      params: {
        book_uuid: "book123",
      },
      body: {
        user_uuid: "user456",
      },
    });
    const res = mockResponse();

    (favoriteService.favoriteBook as jest.Mock).mockRejectedValue(
      new Error("Erro inesperado")
    );

    await favoriteController.favoriteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro inesperado" });
  });
});

describe("favoriteController.getFavorites", () => {
  it("deve retornar os favoritos do usuário com sucesso", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user456",
      },
    });
    const res = mockResponse();

    const favoritesMock = [
      { book_uuid: "book123", title: "Livro Teste 1" },
      { book_uuid: "book456", title: "Livro Teste 2" },
    ];

    (favoriteService.getFavorites as jest.Mock).mockResolvedValue(
      favoritesMock
    );

    await favoriteController.getFavorites(req, res);

    expect(favoriteService.getFavorites).toHaveBeenCalledWith("user456");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(favoritesMock);
  });

  it("deve retornar erro 404 se o serviço retornar erro", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user456",
      },
    });
    const res = mockResponse();

    (favoriteService.getFavorites as jest.Mock).mockResolvedValue({
      error: "Favoritos não encontrados",
    });

    await favoriteController.getFavorites(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Favoritos não encontrados",
    });
  });

  it("deve tratar exceções e retornar 500", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user456",
      },
    });
    const res = mockResponse();

    (favoriteService.getFavorites as jest.Mock).mockRejectedValue(
      new Error("Erro inesperado")
    );

    await favoriteController.getFavorites(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro inesperado" });
  });
});
