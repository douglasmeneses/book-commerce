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

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    cart: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});
jest.mock("../cartItem", () => ({
  addBookToCart: jest.fn(),
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
  it("Deve dar erro se o usuario for invalido", async () => {});
  it("Deve dar erro se o livro for invalido", async () => {});
  it("Deve dar erro se o cartItem der erro", async () => {});
  it("Deve dar erro se não achar o carrinho", async () => {});
  it("Deve dar erro se o prisma der erro", async () => {});
  it("Deve criar um novo carrinho se o usuario não tiver um", async () => {});
  it("Deve adicionar o livro ao carrinho", async () => {});
});

describe("cartService.getCartById", () => {});

describe("cartService.getCartByUser_UUID", () => {});

describe("cartService.removeBookToCart", () => {});

describe("cartService.deleteCartItem", () => {});
