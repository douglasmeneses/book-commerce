import { PrismaClient } from "@prisma/client";
import cartService from "../cartService";
import cartItemService from "../cartItem";
import { bookExists } from "../../middlewares/bookValidators";
import { userExists } from "../../middlewares/userValidators";
import {
  cartValidates,
  removeBookToCartValidates,
} from "../../middlewares/cartValidators";
import { CartResponse } from "../../types/cartTypes";
import { Decimal } from "@prisma/client/runtime/library";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    cart: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    cartItem: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});
jest.mock("../cartItem", () => ({
  addBookToCart: jest.fn(),
  removeBookToCart: jest.fn(),
  deleteCartItem: jest.fn(),
  getCartItemById: jest.fn(),
}));
jest.mock("../../middlewares/bookValidators", () => ({
  bookExists: jest.fn(),
}));
jest.mock("../../middlewares/userValidators", () => ({
  userExists: jest.fn(),
}));
jest.mock("../../middlewares/cartValidators", () => ({
  cartValidates: jest.fn(),
  removeBookToCartValidates: jest.fn(),
}));
jest.mock("../../types/cartTypes", () => ({
  CartResponse: jest.fn(),
}));

const prisma = new PrismaClient();

describe("cartService.addBookToCart", () => {
  it("Deve dar erro se o usuario for invalido", async () => {
    const user_uuid = "invalid-uuid";
    const book_uuid = "valid-uuid";
    const quantity = 1;

    (cartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ error: "User not found" });

    const result = await cartService.addBookToCart(
      user_uuid,
      book_uuid,
      quantity
    );
    if ("error" in result) expect(result.error).toBe("User not found");
  });
  it("Deve dar erro se o livro for invalido", async () => {
    const user_uuid = "valid-uuid";
    const book_uuid = "invalid-uuid";
    const quantity = 1;

    (cartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (bookExists as jest.Mock).mockReturnValue({ error: "Book not found" });

    const result = await cartService.addBookToCart(
      user_uuid,
      book_uuid,
      quantity
    );
    if ("error" in result) expect(result.error).toBe("Book not found");
  });
  it("Deve dar erro se o cartItem der erro", async () => {
    const user_uuid = "valid-uuid";
    const book_uuid = "valid-uuid";
    const quantity = 1;

    (cartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (bookExists as jest.Mock).mockReturnValue({ id: 1 });
    (cartItemService.addBookToCart as jest.Mock).mockReturnValue({
      error: "Cart item error",
    });

    const result = await cartService.addBookToCart(
      user_uuid,
      book_uuid,
      quantity
    );
    if ("error" in result) expect(result.error).toBe("Cart item error");
  });
  it("Deve dar erro se não achar o carrinho", async () => {
    const user_uuid = "valid-uuid";
    const book_uuid = "valid-uuid";
    const quantity = 1;

    (cartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (bookExists as jest.Mock).mockReturnValue({ id: 1, price: 10 });
    (cartItemService.addBookToCart as jest.Mock).mockReturnValue({});
    (prisma.cart.findFirst as jest.Mock).mockReturnValue(null);
    (prisma.cart.create as jest.Mock).mockResolvedValue({
      id: 1,
      user_id: 1,
      totalPrice: new Decimal(0),
    });

    const result = await cartService.addBookToCart(
      user_uuid,
      book_uuid,
      quantity
    );

    if ("error" in result) expect(result.error).toBe("Cart not found!");
  });

  it("Deve dar erro se o prisma der erro", async () => {
    const user_uuid = "valid-uuid";
    const book_uuid = "valid-uuid";
    const quantity = 1;

    (cartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (bookExists as jest.Mock).mockReturnValue({ id: 1 });
    (cartItemService.addBookToCart as jest.Mock).mockReturnValue({});
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.update as jest.Mock).mockRejectedValue(
      new Error("Prisma error")
    );

    const result = await cartService.addBookToCart(
      user_uuid,
      book_uuid,
      quantity
    );
    if ("error" in result) expect(result.error).toBe("Prisma error");
  });

  it("Deve criar um novo carrinho se o usuario não tiver um", async () => {
    const user_uuid = "valid-uuid";
    const book_uuid = "valid-uuid";
    const quantity = 1;

    (cartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (bookExists as jest.Mock).mockReturnValue({ id: 1, price: 10 });
    (cartItemService.addBookToCart as jest.Mock).mockResolvedValue({});
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.cart.create as jest.Mock).mockResolvedValue({
      id: 1,
      user_id: 1,
      totalPrice: new Decimal(0),
    });
    (prisma.cart.update as jest.Mock).mockResolvedValue({});
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await cartService.addBookToCart(
      user_uuid,
      book_uuid,
      quantity
    );

    expect(result).toEqual({ id: 1 });
  });

  it("Deve adicionar o livro ao carrinho", async () => {
    const user_uuid = "valid-uuid";
    const book_uuid = "valid-uuid";
    const quantity = 1;

    (cartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (bookExists as jest.Mock).mockReturnValue({ id: 1 });
    (cartItemService.addBookToCart as jest.Mock).mockReturnValue({});
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.update as jest.Mock).mockReturnValue({ id: 1 });

    const result = await cartService.addBookToCart(
      user_uuid,
      book_uuid,
      quantity
    );
    expect(result).toEqual({ id: 1 });
  });
});

describe("cartService.getCartById", () => {
  it("Deve retornar erro se o carrinho não for encontrado", async () => {
    const cartId = 1;

    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await cartService.getCartById(cartId);

    if ("error" in result) expect(result.error).toBe("Cart not found!");
  });

  it("Deve retornar erro se o prisma der erro", async () => {
    const cartId = 1;

    (prisma.cart.findFirst as jest.Mock).mockRejectedValue(
      new Error("Prisma error")
    );

    const result = await cartService.getCartById(cartId);

    if ("error" in result) expect(result.error).toBe("Prisma error");
  });

  it("Deve retornar o carrinho se encontrado", async () => {
    const cartId = 1;
    const mockCart = {
      id: cartId,
      cartItem: [{ id: 1, book: { id: 1, title: "Book Title" } }],
    };

    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(mockCart);

    const result = await cartService.getCartById(cartId);

    expect(result).toEqual(mockCart);
  });
});

describe("cartService.getCartByUser_UUID", () => {
  it("Deve retornar erro se o usuário não for encontrado", async () => {
    const user_uuid = "invalid-uuid";

    (userExists as jest.Mock).mockReturnValue({ error: "User not found" });

    const result = await cartService.getCartByUser_UUID(user_uuid);

    if ("error" in result) expect(result.error).toBe("User not found");
  });

  it("Deve retornar erro se o carrinho não for encontrado", async () => {
    const user_uuid = "valid-uuid";

    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await cartService.getCartByUser_UUID(user_uuid);

    if ("error" in result) expect(result.error).toBe("Cart not found!");
  });

  it("Deve retornar erro se o prisma der erro", async () => {
    const user_uuid = "valid-uuid";

    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockRejectedValue(
      new Error("Prisma error")
    );

    const result = await cartService.getCartByUser_UUID(user_uuid);

    if ("error" in result) expect(result.error).toBe("Prisma error");
  });

  it("Deve retornar o carrinho se encontrado", async () => {
    const user_uuid = "valid-uuid";
    const mockCart = {
      id: 1,
      cartItem: [
        {
          id: 1,
          book: {
            id: 1,
            title: "Book Title",
            authors: [{ author: { id: 1, name: "Author Name" } }],
            genres: [{ genre: { id: 1, name: "Genre Name" } }],
            publishers: [{ publisher: { id: 1, name: "Publisher Name" } }],
          },
        },
      ],
    };

    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(mockCart);

    const result = await cartService.getCartByUser_UUID(user_uuid);

    expect(result).toEqual(mockCart);
  });
});

describe("cartService.removeBookToCart", () => {
  it("Deve retornar erro se a validação falhar", async () => {
    const user_uuid = "valid-uuid";
    const cartItem_id = 1;
    const quantity = 1;

    (removeBookToCartValidates as jest.Mock).mockReturnValue({
      error: "Validation error",
    });

    const result = await cartService.removeBookToCart(
      user_uuid,
      cartItem_id,
      quantity
    );

    if ("error" in result) expect(result.error).toBe("Validation error");
  });

  it("Deve retornar erro se o usuário não for encontrado", async () => {
    const user_uuid = "invalid-uuid";
    const cartItem_id = 1;
    const quantity = 1;

    (removeBookToCartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ error: "User not found" });

    const result = await cartService.removeBookToCart(
      user_uuid,
      cartItem_id,
      quantity
    );

    if ("error" in result) expect(result.error).toBe("User not found");
  });

  it("Deve retornar erro se o carrinho não for encontrado", async () => {
    const user_uuid = "valid-uuid";
    const cartItem_id = 1;
    const quantity = 1;

    (removeBookToCartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({
      error: "Cart not found!",
    });

    const result = await cartService.removeBookToCart(
      user_uuid,
      cartItem_id,
      quantity
    );

    if ("error" in result) expect(result.error).toBe("Cart not found!");
  });

  it("Deve retornar erro se o cartItem não for encontrado", async () => {
    const user_uuid = "valid-uuid";
    const cartItem_id = 1;
    const quantity = 1;

    (removeBookToCartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({ id: 1 });
    (cartItemService.removeBookToCart as jest.Mock).mockReturnValue(null);

    const result = await cartService.removeBookToCart(
      user_uuid,
      cartItem_id,
      quantity
    );

    if ("error" in result) expect(result.error).toBe("Cart item not found!");
  });

  it("Deve retornar erro se o cartItem retornar erro", async () => {
    const user_uuid = "valid-uuid";
    const cartItem_id = 1;
    const quantity = 1;

    (removeBookToCartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({ id: 1 });
    (cartItemService.removeBookToCart as jest.Mock).mockReturnValue({
      error: "Cart item error",
    });

    const result = await cartService.removeBookToCart(
      user_uuid,
      cartItem_id,
      quantity
    );

    if ("error" in result) expect(result.error).toBe("Cart item error");
  });

  it("Deve retornar erro se o prisma der erro ao atualizar o carrinho", async () => {
    const user_uuid = "valid-uuid";
    const cartItem_id = 1;
    const quantity = 1;

    (removeBookToCartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({
      id: 1,
      totalPrice: new Decimal(100),
    });
    (cartItemService.removeBookToCart as jest.Mock).mockReturnValue({
      book: { price: 10 },
    });
    (prisma.cart.update as jest.Mock).mockRejectedValue(
      new Error("Prisma error")
    );

    const result = await cartService.removeBookToCart(
      user_uuid,
      cartItem_id,
      quantity
    );

    if ("error" in result) expect(result.error).toBe("Prisma error");
  });

  it("Deve remover o livro do carrinho e atualizar o total", async () => {
    const user_uuid = "valid-uuid";
    const cartItem_id = 1;
    const quantity = 1;

    (removeBookToCartValidates as jest.Mock).mockReturnValue(null);
    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({
      id: 1,
      totalPrice: new Decimal(100),
    });
    (cartItemService.removeBookToCart as jest.Mock).mockReturnValue({
      book: { price: 10 },
    });
    (prisma.cart.update as jest.Mock).mockResolvedValue({});
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({
      id: 1,
      totalPrice: new Decimal(90),
    });

    const result = await cartService.removeBookToCart(
      user_uuid,
      cartItem_id,
      quantity
    );

    expect(result).toEqual({ id: 1, totalPrice: new Decimal(90) });
  });
});

describe("cartService.deleteCartItem", () => {
  it("Deve retornar erro se o usuário não for encontrado", async () => {
    const user_uuid = "invalid-uuid";
    const cartItem_id = 1;

    (userExists as jest.Mock).mockReturnValue({ error: "User not found" });

    const result = await cartService.deleteCartItem(user_uuid, cartItem_id);

    if ("error" in result) expect(result.error).toBe("User not found");
  });

  it("Deve retornar erro se o carrinho não for encontrado", async () => {
    const user_uuid = "valid-uuid";
    const cartItem_id = 1;

    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({
      error: "Cart not found!",
    });

    const result = await cartService.deleteCartItem(user_uuid, cartItem_id);

    if ("error" in result) expect(result.error).toBe("Cart not found!");
  });

  it("Deve retornar erro se o cartItem não for encontrado", async () => {
    const user_uuid = "valid-uuid";
    const cartItem_id = 1;

    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({ id: 1 });
    (cartItemService.getCartItemById as jest.Mock).mockReturnValue({
      error: "Cart item not found!",
    });

    const result = await cartService.deleteCartItem(user_uuid, cartItem_id);

    if ("error" in result) expect(result.error).toBe("Cart item not found!");
  });

  it("Deve retornar erro se o prisma der erro ao atualizar o carrinho", async () => {
    const user_uuid = "valid-uuid";
    const cartItem_id = 1;

    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({
      id: 1,
      totalPrice: new Decimal(100),
    });
    (cartItemService.getCartItemById as jest.Mock).mockReturnValue({
      price: new Decimal(10),
    });
    (prisma.cart.update as jest.Mock).mockRejectedValue(
      new Error("Prisma error")
    );

    const result = await cartService.deleteCartItem(user_uuid, cartItem_id);

    if ("error" in result) expect(result.error).toBe("Prisma error");
  });

  it("Deve retornar erro se o cartItemService.deleteCartItem retornar erro", async () => {
    const user_uuid = "valid-uuid";
    const cartItem_id = 1;

    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({
      id: 1,
      totalPrice: new Decimal(100),
    });
    (cartItemService.getCartItemById as jest.Mock).mockReturnValue({
      price: new Decimal(10),
    });
    (prisma.cart.update as jest.Mock).mockResolvedValue({});
    (cartItemService.deleteCartItem as jest.Mock).mockReturnValue({
      error: "Delete cart item error",
    });

    const result = await cartService.deleteCartItem(user_uuid, cartItem_id);

    if ("error" in result) expect(result.error).toBe("Delete cart item error");
  });

  it("Deve deletar o cartItem e atualizar o carrinho", async () => {
    const user_uuid = "valid-uuid";
    const cartItem_id = 1;

    (userExists as jest.Mock).mockReturnValue({ id: 1 });
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({
      id: 1,
      totalPrice: new Decimal(100),
    });
    (cartItemService.getCartItemById as jest.Mock).mockReturnValue({
      price: new Decimal(10),
    });
    (prisma.cart.update as jest.Mock).mockResolvedValue({});
    (cartItemService.deleteCartItem as jest.Mock).mockReturnValue(true);
    (prisma.cart.findFirst as jest.Mock).mockReturnValue({
      id: 1,
      totalPrice: new Decimal(90),
    });

    const result = await cartService.deleteCartItem(user_uuid, cartItem_id);

    expect(result).toEqual({ id: 1, totalPrice: new Decimal(90) });
  });
});
