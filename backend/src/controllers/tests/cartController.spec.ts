// tests/controllers/cartController.test.ts

import cartController from "../../controllers/cartController";
import cartService from "../../services/cartService";
import { processCartItems } from "../../utils/cartUtils";
import { mockRequest, mockResponse } from "./__utils__/index";
import { Decimal } from "@prisma/client/runtime/library";

jest.mock("../../services/cartService", () => ({
  __esModule: true,
  default: {
    addBookToCart: jest.fn(),
    removeBookToCart: jest.fn(),
    getCartByUser_UUID: jest.fn(),
    deleteCartItem: jest.fn(),
  },
}));

jest.mock("../../utils/cartUtils", () => ({
  __esModule: true,
  processCartItems: jest.fn(),
}));

describe("cartController.addBookToCart", () => {
  it("deve adicionar um livro ao carrinho com sucesso", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user123",
        book_uuid: "book456",
      },
      body: {
        quantity: 2,
      },
    });
    const res = mockResponse();

    const fakeCartItem = {
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      price: new Decimal(39.9),
      quantity: 1,
      book: {
        uuid: "uuid-123",
        title: "Livro Teste",
        price: new Decimal(39.9),
        image: null,
        image_url: "https://exemplo.com/imagem.jpg",
        stock_quantity: 10,
        authors: [
          {
            author: {
              name: "Autor Teste",
            },
          },
        ],
      },
    };

    const fakeCart = {
      totalPrice: new Decimal(88.98),
      cartItem: [fakeCartItem],
    };

    (cartService.addBookToCart as jest.Mock).mockResolvedValue(fakeCart);
    (processCartItems as jest.Mock).mockResolvedValue([fakeCartItem]);

    await cartController.addBookToCart(req, res);

    expect(cartService.addBookToCart).toHaveBeenCalledWith(
      "user123",
      "book456",
      2
    );
    expect(processCartItems).toHaveBeenCalledWith([fakeCartItem]);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totalPrice: expect.any(Number),
        cartItem: expect.any(Array),
      })
    );
  });

  it("deve retornar erro 400 se o service retornar erro", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user123",
        book_uuid: "book456",
      },
      body: {
        quantity: 1,
      },
    });
    const res = mockResponse();

    (cartService.addBookToCart as jest.Mock).mockResolvedValue({
      error: "Livro não encontrado",
    });

    await cartController.addBookToCart(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Livro não encontrado" });
  });

  it("deve tratar exceções e retornar 500", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user123",
        book_uuid: "book456",
      },
      body: {
        quantity: 1,
      },
    });
    const res = mockResponse();

    (cartService.addBookToCart as jest.Mock).mockRejectedValue(
      new Error("Erro inesperado")
    );

    await cartController.addBookToCart(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro inesperado" });
  });
});

describe("cartController.removeBookToCart", () => {
  it("deve remover um livro do carrinho com sucesso", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user123",
        cartItem_id: "1",
      },
      body: {
        quantity: 1,
      },
    });
    const res = mockResponse();

    const fakeCartItem = {
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      price: new Decimal(39.9),
      quantity: 1,
      book: {
        uuid: "uuid-123",
        title: "Livro Teste",
        price: new Decimal(39.9),
        image: null,
        image_url: "https://exemplo.com/imagem.jpg",
        stock_quantity: 10,
        authors: [
          {
            author: {
              name: "Autor Teste",
            },
          },
        ],
      },
    };

    const fakeCart = {
      totalPrice: new Decimal(39.9),
      cartItem: [fakeCartItem],
    };

    (cartService.removeBookToCart as jest.Mock).mockResolvedValue(fakeCart);
    (processCartItems as jest.Mock).mockResolvedValue([fakeCartItem]);

    await cartController.removeBookToCart(req, res);
    expect(cartService.removeBookToCart).toHaveBeenCalledWith("user123", 1, 1);
    expect(processCartItems).toHaveBeenCalledWith([fakeCartItem]);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totalPrice: expect.any(Number),
        cartItem: expect.any(Array),
      })
    );
  });

  it("deve retornar erro 400 se o service retornar erro", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user123",
        cartItem_id: "1",
      },
      body: {
        quantity: 1,
      },
    });
    const res = mockResponse();

    (cartService.removeBookToCart as jest.Mock).mockResolvedValue({
      error: "Erro ao remover livro",
    });

    await cartController.removeBookToCart(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao remover livro" });
  });

  it("deve tratar exceções e retornar 500", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user123",
        cartItem_id: "1",
      },
      body: {
        quantity: 1,
      },
    });
    const res = mockResponse();

    (cartService.removeBookToCart as jest.Mock).mockRejectedValue(
      new Error("Erro inesperado")
    );

    await cartController.removeBookToCart(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro inesperado" });
  });
});
describe("cartController.getCartByUser_UUID", () => {
  it("deve retornar o carrinho do usuário com sucesso", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user123",
      },
    });
    const res = mockResponse();

    const fakeCartItem = {
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      price: new Decimal(39.9),
      quantity: 1,
      book: {
        uuid: "uuid-123",
        title: "Livro Teste",
        price: new Decimal(39.9),
        image: null,
        image_url: "https://exemplo.com/imagem.jpg",
        stock_quantity: 10,
        authors: [
          {
            author: {
              name: "Autor Teste",
            },
          },
        ],
      },
    };

    const fakeCart = {
      totalPrice: new Decimal(39.9),
      cartItem: [fakeCartItem],
    };

    (cartService.getCartByUser_UUID as jest.Mock).mockResolvedValue(fakeCart);
    (processCartItems as jest.Mock).mockResolvedValue([fakeCartItem]);

    await cartController.getCartByUser_UUID(req, res);

    expect(cartService.getCartByUser_UUID).toHaveBeenCalledWith("user123");
    expect(processCartItems).toHaveBeenCalledWith([fakeCartItem]);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totalPrice: expect.any(Number),
        cartItem: expect.any(Array),
      })
    );
  });

  it("deve retornar erro 400 se o service retornar erro", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user123",
      },
    });
    const res = mockResponse();

    (cartService.getCartByUser_UUID as jest.Mock).mockResolvedValue({
      error: "Carrinho não encontrado",
    });

    await cartController.getCartByUser_UUID(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Carrinho não encontrado" });
  });

  it("deve tratar exceções e retornar 500", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user123",
      },
    });
    const res = mockResponse();

    (cartService.getCartByUser_UUID as jest.Mock).mockRejectedValue(
      new Error("Erro inesperado")
    );

    await cartController.getCartByUser_UUID(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro inesperado" });
  });
});

describe("cartController.deleteCartItem", () => {
  it("deve deletar um item do carrinho com sucesso", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user123",
        cartItem_id: "1",
      },
    });
    const res = mockResponse();

    const fakeCartItem = {
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      price: new Decimal(39.9),
      quantity: 1,
      book: {
        uuid: "uuid-123",
        title: "Livro Teste",
        price: new Decimal(39.9),
        image: null,
        image_url: "https://exemplo.com/imagem.jpg",
        stock_quantity: 10,
        authors: [
          {
            author: {
              name: "Autor Teste",
            },
          },
        ],
      },
    };

    const fakeCart = {
      totalPrice: new Decimal(0),
      cartItem: [],
    };

    (cartService.deleteCartItem as jest.Mock).mockResolvedValue(fakeCart);
    (processCartItems as jest.Mock).mockResolvedValue([]);

    await cartController.deleteCartItem(req, res);

    expect(cartService.deleteCartItem).toHaveBeenCalledWith("user123", 1);
    expect(processCartItems).toHaveBeenCalledWith([]);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totalPrice: expect.any(Number),
        cartItem: expect.any(Array),
      })
    );
  });

  it("deve retornar erro 400 se o service retornar erro", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user123",
        cartItem_id: "1",
      },
    });
    const res = mockResponse();

    (cartService.deleteCartItem as jest.Mock).mockResolvedValue({
      error: "Erro ao deletar item",
    });

    await cartController.deleteCartItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao deletar item" });
  });

  it("deve tratar exceções e retornar 500", async () => {
    const req = mockRequest({
      params: {
        user_uuid: "user123",
        cartItem_id: "1",
      },
    });
    const res = mockResponse();

    (cartService.deleteCartItem as jest.Mock).mockRejectedValue(
      new Error("Erro inesperado")
    );

    await cartController.deleteCartItem(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro inesperado" });
  });
});
