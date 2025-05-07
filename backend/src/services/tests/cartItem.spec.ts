import cartItemService from "../cartItem";
import bookService from "../bookService";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

jest.mock("@prisma/client", () => {
  const mPrisma = {
    cartItem: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cart: {
      findFirst: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrisma),
  };
});

jest.mock("../bookService", () => ({
  getBookById: jest.fn(),
}));

const prisma = new PrismaClient();

describe("cartItemService.getCartItemById", () => {
  it("Deve retornar erro se o item do carrinho não for encontrado", async () => {
    const fakeId = 1;
    (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await cartItemService.getCartItemById(fakeId);

    expect(result).toEqual({ error: "Cart item not found!" });
  });

  it("Deve retornar erro se ocorrer um erro ao buscar o item do carrinho", async () => {
    const fakeId = 1;
    const fakeError = new Error("Database error");
    (prisma.cartItem.findFirst as jest.Mock).mockRejectedValue(fakeError);

    const result = await cartItemService.getCartItemById(fakeId);

    expect(result).toEqual({
      error: "Database error",
    });
  });

  it("Deve retornar o item do carrinho com sucesso", async () => {
    const fakeId = 1;
    const fakeCartItem = {
      id: fakeId,
      cart_id: 1,
      book_id: 1,
      quantity: 2,
    };
    (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(fakeCartItem);

    const result = await cartItemService.getCartItemById(fakeId);

    expect(result).toEqual(fakeCartItem);
  });
});

describe("cartItemService.addBookToCart", () => {
  it("Deve retornar erro se o carrinho não for encontrado", async () => {
    const fakeUserId = 1;
    const fakeBookId = 1;
    const fakeQuantity = 2;
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(null);

    (bookService.getBookById as jest.Mock).mockResolvedValue({
      id: fakeBookId,
      stock_quantity: 5,
    });

    const result = await cartItemService.addBookToCart(
      fakeUserId,
      fakeBookId,
      fakeQuantity
    );

    expect(result).toEqual({ error: "Cart not found" });
  });

  it("Deve retornar erro se o livro não for encontrado", async () => {
    const fakeUserId = 1;
    const fakeBookId = 1;
    const fakeQuantity = 2;
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

    (bookService.getBookById as jest.Mock).mockResolvedValue({
      error: "Book not found",
    });

    const result = await cartItemService.addBookToCart(
      fakeUserId,
      fakeBookId,
      fakeQuantity
    );

    expect(result).toEqual({ error: "Book not found" });
  });

  it("Deve retornar erro se a quantidade for inválida", async () => {
    const fakeUserId = 1;
    const fakeBookId = 1;
    const fakeQuantity = -1;
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

    (bookService.getBookById as jest.Mock).mockResolvedValue({
      id: fakeBookId,
      stock_quantity: 5,
    });

    const result = await cartItemService.addBookToCart(
      fakeUserId,
      fakeBookId,
      fakeQuantity
    );

    expect(result).toEqual({ error: "Invalid quantity" });
  });

  it("Deve retornar erro se não houver estoque suficiente", async () => {
    const fakeUserId = 1;
    const fakeBookId = 1;
    const fakeQuantity = 10;
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

    (bookService.getBookById as jest.Mock).mockResolvedValue({
      id: fakeBookId,
      stock_quantity: 5,
    });

    const result = await cartItemService.addBookToCart(
      fakeUserId,
      fakeBookId,
      fakeQuantity
    );

    expect(result).toEqual({ error: "Not enough stock" });
  });

  it("Deve adicionar o livro ao carrinho, se o item não existir", async () => {
    const fakeUserId = 1;
    const fakeBookId = 1;
    const fakeQuantity = 2;
    const fakeCart = { id: 1 };
    const fakeBook = { id: fakeBookId, stock_quantity: 5 };
    const fakeCartItem = {
      id: 1,
      cart_id: fakeCart.id,
      book_id: fakeBookId,
      quantity: 0,
    };

    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(fakeCart);
    (bookService.getBookById as jest.Mock).mockResolvedValue(fakeBook);
    (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.cartItem.create as jest.Mock).mockResolvedValue(fakeCartItem);
    (prisma.cartItem.update as jest.Mock).mockResolvedValue({
      ...fakeCartItem,
      quantity: fakeQuantity,
    });

    const result = await cartItemService.addBookToCart(
      fakeUserId,
      fakeBookId,
      fakeQuantity
    );

    expect(result).toEqual({
      ...fakeCartItem,
      quantity: fakeQuantity,
    });
  });

  it("Deve adicionar o livro ao carrinho, se o item já existir", async () => {
    const fakeUserId = 1;
    const fakeBookId = 1;
    const fakeQuantity = 2;
    const fakeCart = { id: 1 };
    const fakeBook = { id: fakeBookId, stock_quantity: 5 };
    const fakeCartItem = {
      id: 1,
      cart_id: fakeCart.id,
      book_id: fakeBookId,
      quantity: 0,
    };

    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(fakeCart);
    (bookService.getBookById as jest.Mock).mockResolvedValue(fakeBook);
    (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(fakeCartItem);
    (prisma.cartItem.update as jest.Mock).mockResolvedValue({
      ...fakeCartItem,
      quantity: fakeQuantity,
    });

    const result = await cartItemService.addBookToCart(
      fakeUserId,
      fakeBookId,
      fakeQuantity
    );

    expect(result).toEqual({
      ...fakeCartItem,
      quantity: fakeQuantity,
    });
  });
});
describe("cartItemService.removeBookToCart", () => {
  it("Deve retornar erro se o item do carrinho não for encontrado", async () => {
    const fakeId = 1;
    const fakeQuantity = 2;
    (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await cartItemService.removeBookToCart(fakeId, fakeQuantity);

    expect(result).toEqual({ error: "Cart item not found!" });
  });

  it("Deve retornar erro se a quantidade for inválida", async () => {
    const fakeId = 1;
    const fakeQuantity = 5;
    const fakeCartItem = {
      id: fakeId,
      quantity: 3,
      book: { price: 10 },
    };
    (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(fakeCartItem);

    const result = await cartItemService.removeBookToCart(fakeId, fakeQuantity);

    expect(result).toEqual({ error: "Invalid quantity" });
  });

  it("Deve atualizar o item do carrinho com a nova quantidade e preço", async () => {
    const fakeId = 1;
    const fakeQuantity = 2;
    const fakeCartItem = {
      id: fakeId,
      quantity: 5,
      price: new Decimal(50),
      book: { price: 10 },
    };
    const updatedCartItem = {
      ...fakeCartItem,
      quantity: 3,
      price: 30,
    };

    (prisma.cartItem.findFirst as jest.Mock)
      .mockResolvedValueOnce(fakeCartItem)
      .mockResolvedValueOnce(updatedCartItem);
    (prisma.cartItem.update as jest.Mock).mockResolvedValue(updatedCartItem);

    const result = await cartItemService.removeBookToCart(fakeId, fakeQuantity);

    expect(prisma.cartItem.update).toHaveBeenCalledWith({
      where: { id: fakeId },
      data: {
        quantity: fakeCartItem.quantity - fakeQuantity,
        price:
          fakeCartItem.price.toNumber() -
          fakeQuantity * fakeCartItem.book.price,
      },
    });
    expect(result).toEqual(updatedCartItem);
  });

  it("Deve retornar erro se ocorrer um erro ao remover o item do carrinho", async () => {
    const fakeId = 1;
    const fakeQuantity = 2;
    const fakeError = new Error("Database error");

    (prisma.cartItem.findFirst as jest.Mock).mockRejectedValue(fakeError);

    const result = await cartItemService.removeBookToCart(fakeId, fakeQuantity);

    expect(result).toEqual({ error: "Database error" });
  });
});
describe("cartItemService.deleteCartItem", () => {
  it("Deve retornar erro se o item do carrinho não for encontrado", async () => {
    const fakeId = 1;
    (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await cartItemService.deleteCartItem(fakeId);

    expect(result).toEqual({ error: "Cart item not found!" });
  });

  it("Deve deletar o item do carrinho com sucesso", async () => {
    const fakeId = 1;
    const fakeCartItem = {
      id: fakeId,
      cart_id: 1,
      book_id: 1,
      quantity: 2,
    };
    (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(fakeCartItem);
    (prisma.cartItem.delete as jest.Mock).mockResolvedValue(fakeCartItem);

    const result = await cartItemService.deleteCartItem(fakeId);

    expect(prisma.cartItem.delete).toHaveBeenCalledWith({
      where: { id: fakeId },
    });
    expect(result).toEqual(true);
  });

  it("Deve retornar erro se ocorrer um erro ao deletar o item do carrinho", async () => {
    const fakeId = 1;
    const fakeError = new Error("Database error");

    (prisma.cartItem.findFirst as jest.Mock).mockRejectedValue(fakeError);

    const result = await cartItemService.deleteCartItem(fakeId);

    expect(result).toEqual({ error: "Database error" });
  });
});
