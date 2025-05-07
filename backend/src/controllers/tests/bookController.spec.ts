import bookController from "../../controllers/bookController";
import bookService from "../../services/bookService";
import { handleBookImage, processBookImages } from "../../utils/bookUtils";
import { mockRequest, mockResponse } from "./__utils__/index";

jest.mock("../../services/bookService", () => ({
  __esModule: true,
  default: {
    bookRegister: jest.fn(),
    getBooks: jest.fn(),
    getBookByUUID: jest.fn(),
    updateBook: jest.fn(),
    bookDelete: jest.fn(),
    uploadBookImage: jest.fn(),
  },
}));

jest.mock("../../utils/bookUtils", () => ({
  __esModule: true,
  handleBookImage: jest.fn(),
  processBookImages: jest.fn(),
}));

describe("bookController.registerBook", () => {
  it("deve registrar um livro com sucesso", async () => {
    const req = mockRequest({
      body: {
        user_uuid: "user123",
        book: { title: "Livro Teste" },
      },
    });
    const res = mockResponse();

    const bookMock = { id: 1, title: "Livro Teste" };

    (bookService.bookRegister as jest.Mock).mockResolvedValue(bookMock);
    (handleBookImage as jest.Mock).mockResolvedValue(bookMock);

    await bookController.registerBook(req, res);

    expect(bookService.bookRegister).toHaveBeenCalledWith(
      { title: "Livro Teste" },
      "user123"
    );
    expect(handleBookImage).toHaveBeenCalledWith(bookMock);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(bookMock);
  });

  it("deve retornar erro se o bookService retornar erro", async () => {
    const req = mockRequest({
      body: {
        user_uuid: "user123",
        book: { title: "Livro Teste" },
      },
    });
    const res = mockResponse();

    (bookService.bookRegister as jest.Mock).mockResolvedValue({
      error: "Erro ao registrar livro",
    });

    await bookController.registerBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao registrar livro" });
  });

  it("deve tratar exceção e retornar 400", async () => {
    const req = mockRequest({
      body: {
        user_uuid: "user123",
        book: { title: "Livro Teste" },
      },
    });
    const res = mockResponse();

    (bookService.bookRegister as jest.Mock).mockRejectedValue(
      new Error("Falha no sistema")
    );

    await bookController.registerBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Falha no sistema" });
  });
});

describe("bookController.getBooks", () => {
  it("deve retornar livros com sucesso", async () => {
    const req = mockRequest({
      query: {
        search: "harry",
      },
    });
    const res = mockResponse();

    const booksMock = [
      { id: 1, title: "Harry Potter" },
      { id: 2, title: "Harry Potter e a Pedra Filosofal" },
    ];

    (bookService.getBooks as jest.Mock).mockResolvedValue(booksMock);
    (processBookImages as jest.Mock).mockResolvedValue(booksMock);

    await bookController.getBooks(req, res);

    expect(bookService.getBooks).toHaveBeenCalledWith(
      expect.objectContaining({
        search: "harry",
        page: 1,
        limit: 10,
      }),
      undefined
    );

    expect(processBookImages).toHaveBeenCalledWith(booksMock);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(booksMock);
  });

  it("deve tratar erro retornado pelo service", async () => {
    const req = mockRequest({
      query: { search: "harry" },
    });
    const res = mockResponse();

    (bookService.getBooks as jest.Mock).mockResolvedValue({
      error: "Erro na busca",
    });

    await bookController.getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro na busca" });
  });

  it("deve tratar erro caso o response não seja um array", async () => {
    const req = mockRequest({
      query: { search: "harry" },
    });
    const res = mockResponse();

    (bookService.getBooks as jest.Mock).mockResolvedValue({});

    await bookController.getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid response format" });
  });

  it("deve tratar exceção e retornar 400", async () => {
    const req = mockRequest({
      query: { search: "harry" },
    });
    const res = mockResponse();

    (bookService.getBooks as jest.Mock).mockRejectedValue(
      new Error("Falha no sistema")
    );

    await bookController.getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Falha no sistema",
    });
  });
});

describe("bookController.getBookByUUID", () => {
  it("deve retornar livro por UUID com sucesso", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
    });
    const res = mockResponse();

    const bookMock = { id: 1, title: "Harry Potter" };

    (bookService.getBookByUUID as jest.Mock).mockResolvedValue(bookMock);
    (handleBookImage as jest.Mock).mockResolvedValue(bookMock);

    await bookController.getBookByUUID(req, res);

    expect(bookService.getBookByUUID).toHaveBeenCalledWith("123-abc");
    expect(handleBookImage).toHaveBeenCalledWith(bookMock);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(bookMock);
  });

  it("deve retornar erro se o livro não for encontrado", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
    });
    const res = mockResponse();

    (bookService.getBookByUUID as jest.Mock).mockResolvedValue(null);

    await bookController.getBookByUUID(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Book not found" });
  });

  it("deve tratar erro retornado pelo service", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
    });
    const res = mockResponse();

    (bookService.getBookByUUID as jest.Mock).mockResolvedValue({
      error: "Erro ao buscar livro",
    });

    await bookController.getBookByUUID(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao buscar livro",
    });
  });

  it("deve tratar exceção e retornar 400", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
    });
    const res = mockResponse();

    (bookService.getBookByUUID as jest.Mock).mockRejectedValue(
      new Error("Falha no sistema")
    );

    await bookController.getBookByUUID(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Falha no sistema",
    });
  });
});
describe("bookController.bookUpdate", () => {
  it("deve atualizar um livro com sucesso", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
      body: {
        user_uuid: "user123",
        title: "Livro Atualizado",
      },
    });
    const res = mockResponse();

    const updatedBookMock = { id: 1, title: "Livro Atualizado" };

    (bookService.updateBook as jest.Mock).mockResolvedValue(updatedBookMock);
    (handleBookImage as jest.Mock).mockResolvedValue(updatedBookMock);

    await bookController.bookUpdate(req, res);

    expect(bookService.updateBook).toHaveBeenCalledWith(
      "123-abc",
      "user123",
      expect.objectContaining({ title: "Livro Atualizado" })
    );
    expect(handleBookImage).toHaveBeenCalledWith(updatedBookMock);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedBookMock);
  });

  it("deve retornar erro se o bookService retornar erro", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
      body: {
        user_uuid: "user123",
        title: "Livro Atualizado",
      },
    });
    const res = mockResponse();

    (bookService.updateBook as jest.Mock).mockResolvedValue({
      error: "Erro ao atualizar livro",
    });

    await bookController.bookUpdate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao atualizar livro" });
  });

  it("deve tratar exceção e retornar 400", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
      body: {
        user_uuid: "user123",
        title: "Livro Atualizado",
      },
    });
    const res = mockResponse();

    (bookService.updateBook as jest.Mock).mockRejectedValue(
      new Error("Falha no sistema")
    );

    await bookController.bookUpdate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Falha no sistema" });
  });
});
describe("bookController.bookDelete", () => {
  it("deve deletar um livro com sucesso", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
      body: { user_uuid: "user123" },
    });
    const res = mockResponse();

    (bookService.bookDelete as jest.Mock).mockResolvedValue({});

    await bookController.bookDelete(req, res);

    expect(bookService.bookDelete).toHaveBeenCalledWith("123-abc", "user123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Book deleted successfully",
    });
  });

  it("deve retornar erro se o bookService retornar erro", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
      body: { user_uuid: "user123" },
    });
    const res = mockResponse();

    (bookService.bookDelete as jest.Mock).mockResolvedValue({
      error: "Erro ao deletar livro",
    });

    await bookController.bookDelete(req, res);

    expect(bookService.bookDelete).toHaveBeenCalledWith("123-abc", "user123");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao deletar livro" });
  });

  it("deve tratar exceção e retornar 400", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
      body: { user_uuid: "user123" },
    });
    const res = mockResponse();

    (bookService.bookDelete as jest.Mock).mockRejectedValue(
      new Error("Falha no sistema")
    );

    await bookController.bookDelete(req, res);

    expect(bookService.bookDelete).toHaveBeenCalledWith("123-abc", "user123");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Falha no sistema" });
  });
});

describe("bookController.uploadBookImage", () => {
  it("deve fazer upload de uma imagem com sucesso", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
      file: { buffer: Buffer.from("image data") },
    });
    const res = mockResponse();

    const uploadResponseMock = { image: "image-url" };
    const bookResponseMock = {
      id: 1,
      title: "Livro Teste",
      image: "image-url",
    };

    (bookService.uploadBookImage as jest.Mock).mockResolvedValue(
      uploadResponseMock
    );
    (handleBookImage as jest.Mock).mockResolvedValue(bookResponseMock);

    await bookController.uploadBookImage(req, res);

    expect(bookService.uploadBookImage).toHaveBeenCalledWith(
      "123-abc",
      expect.any(Buffer)
    );
    expect(handleBookImage).toHaveBeenCalledWith(uploadResponseMock);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(bookResponseMock);
  });

  it("deve retornar erro se nenhuma imagem for enviada", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
    });
    const res = mockResponse();

    await bookController.uploadBookImage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Nenhuma imagem enviada" });
  });

  it("deve retornar erro se o bookService retornar erro", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
      file: { buffer: Buffer.from("image data") },
    });
    const res = mockResponse();

    (bookService.uploadBookImage as jest.Mock).mockResolvedValue({
      error: "Erro ao fazer upload",
    });

    await bookController.uploadBookImage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao fazer upload" });
  });

  it("deve retornar erro se os dados da imagem estiverem ausentes", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
      file: { buffer: Buffer.from("image data") },
    });
    const res = mockResponse();

    (bookService.uploadBookImage as jest.Mock).mockResolvedValue({});

    await bookController.uploadBookImage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Image data is missing" });
  });

  it("deve tratar exceção e retornar 500", async () => {
    const req = mockRequest({
      params: { uuid: "123-abc" },
      file: { buffer: Buffer.from("image data") },
    });
    const res = mockResponse();

    (bookService.uploadBookImage as jest.Mock).mockRejectedValue(
      new Error("Falha no sistema")
    );

    await bookController.uploadBookImage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao fazer upload da imagem",
    });
  });
});
