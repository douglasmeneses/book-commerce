import { bookValidates, bookExists, extractBookData } from "../bookValidators";
import bookService from "../../services/bookService";
import { RegisterBook, UpdateBook } from "../../types/bookTypes";
import validator from "validator";

// Mock de bookService
jest.mock("../../services/bookService");

// Mock do validator
jest.mock("validator", () => ({
  ...jest.requireActual("validator"),
  isAlphanumeric: jest.fn(),
  isISBN: jest.fn(),
}));

const book: RegisterBook = {
  title: "",
  synopsis: "A synopsis",
  ISBN: "1234567890123",
  language: "Portuguese",
  price: 10,
  page_count: 100,
  stock_quantity: 10,
  release_date: new Date("2023-01-01"),
  publishers: [],
  authors: ["Author"],
  genres: ["Genre"],
};

describe("bookValidates", () => {
  it("should return an error if title is empty", async () => {
    const result = await bookValidates(book);
    expect(result).toEqual({ error: "Title is required" });
  });

  it("should return an error if ISBN is invalid", async () => {
    const book: RegisterBook = {
      title: "Livro válido",
      synopsis: "Uma descrição válida",
      ISBN: "123", // inválido
      language: "Portuguese",
      price: 20,
      page_count: 200,
      stock_quantity: 15,
      release_date: new Date("2023-01-01"),
      publishers: ["Editora"],
      authors: ["Autor"],
      genres: ["Ficção"],
    };

    const result = await bookValidates(book);
    expect(result).toEqual({ error: "ISBN is required" });
  });

  it("should return null if all validations pass", async () => {
    (validator.isISBN as jest.Mock).mockReturnValue(true);

    const book: RegisterBook = {
      title: "Livro Válido",
      synopsis: "Sinopse valida",
      ISBN: "9781234567897",
      language: "Portuguese",
      price: 30,
      page_count: 300,
      stock_quantity: 10,
      release_date: new Date("2023-01-01"),
      publishers: ["Editora"],
      authors: ["Autor"],
      genres: ["Fantasia"],
    };

    const result = await bookValidates(book);
    expect(result).toBeNull();
  });
});

describe("bookExists", () => {
  it("should return an error if uuid is invalid", async () => {
    const result = await bookExists("");
    expect(result).toEqual({ error: "Book ID is required" });
  });

  it("should return an error if book is not found", async () => {
    (bookService.getBookByUUID as jest.Mock).mockResolvedValue({
      error: "Book not found",
    });

    const result = await bookExists("invalid-uuid");
    expect(result).toEqual({ error: "Book not found" });
  });

  it("should return the book if it exists", async () => {
    const book = { uuid: "valid-uuid", title: "Book Title" };
    (bookService.getBookByUUID as jest.Mock).mockResolvedValue(book);

    const result = await bookExists("valid-uuid");
    expect(result).toEqual(book);
  });
});

// NÃO FAZ SENTIDO UUID NO EXTRACTBOOKDATA
describe("extractBookData", () => {
  // it("should extract valid fields from the book object", async () => {
  //   (validator.isAlphanumeric as jest.Mock).mockReturnValue(true);
  //   (validator.isISBN as jest.Mock).mockReturnValue(true);

  //   const uuid = "uuid";
  //   const book: UpdateBook = {
  //     title: "Titulo Atualizado",
  //     synopsis: "Sinopse atualizada",
  //     ISBN: "9781234567897",
  //     language: "Portuguese",
  //     price: 20,
  //     page_count: 200,
  //     stock_quantity: 15,
  //     release_date: new Date("2023-01-01"),
  //   };

  //   const result = await extractBookData(uuid, book);

  //   expect(result).toEqual({
  //     title: "Titulo Atualizado",
  //     synopsis: "Sinopse atualizada",
  //     ISBN: "9781234567897",
  //     language: "Portuguese",
  //     price: 20,
  //     page_count: 200,
  //     stock_quantity: 15,
  //     release_date: new Date("2023-01-01"),
  //   });
  // });

  it("should ignore invalid fields", async () => {
    const uuid = "valid-uuid";
    const book: UpdateBook = {
      uuid: "uuid",
      title: "",
      synopsis: "",
      ISBN: "invalidISBN",
      language: "123",
      price: -10,
      page_count: -5,
      stock_quantity: -1,
      release_date: new Date("invalid-date"),
    };

    (validator.isAlphanumeric as jest.Mock).mockReturnValue(false);
    (validator.isISBN as jest.Mock).mockReturnValue(false);

    const result = await extractBookData(uuid, book);
    expect(result).toEqual({});
  });
});
