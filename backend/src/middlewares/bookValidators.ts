import validator from "validator";
import { RegisterBook, UpdateBook, error } from "../types/bookTypes";
import { Book, PrismaClient } from "@prisma/client";
import bookService from "../services/bookService";

export const bookValidates = async (book: RegisterBook) => {
  if (book.title.trim() === "") return { error: "Title is required" };
  if (
    book.synopsis.trim() === "" ||
    !validator.isAlpha(book.language, "pt-BR", { ignore: " " })
  )
    return { error: "Synopsis is required" };
  if (book.ISBN.trim() === "" || !validator.isISBN(book.ISBN))
    return { error: "ISBN is required" };
  if (
    book.language.trim() === "" ||
    !validator.isAlpha(book.language, "pt-BR", { ignore: " " })
  )
    return { error: "Language is required" };
  if (book.price <= 0) return { error: "Price is required" };
  if (book.page_count <= 0) return { error: "Page count is required" };
  if (book.stock_quantity < 0 || !Number.isInteger(book.stock_quantity))
    return { error: "Stock quantity is required" };
  if (book.image && !(book.image instanceof Uint8Array))
    return { error: "Valid image is required" };
  const releaseDate = new Date(book.release_date);
  if (isNaN(releaseDate.getTime())) return { error: "Invalid release date" };
  if (book.authors.length === 0) return { error: "Authors are required" };
  if (book.genres.length === 0) return { error: "Genres are required" };
  const existingBook = await bookService.getBookByISBN(book.ISBN);
  if (existingBook) return { error: "ISBN already exists" };
  return null;
};

export const bookExists = async (uuid: string): Promise<error | Book> => {
  if (!uuid || typeof uuid !== "string")
    return { error: "Book ID is required" };

  const book = await bookService.getBookByUUID(uuid);
  if ("error" in book) return { error: "Book not found" };

  return book;
};

export const extractBookData = async (uuid: string, book: UpdateBook) => {
  const updatedData: any = {};

  if (
    book.title &&
    validator.isAlphanumeric(book.title, "pt-BR", { ignore: " :" })
  )
    updatedData.title = book.title;
  if (
    book.synopsis &&
    validator.isAlphanumeric(book.synopsis, "pt-BR", { ignore: " :" })
  )
    updatedData.synopsis = book.synopsis;
  if (book.ISBN && validator.isISBN(book.ISBN)) {
    const existingBook = await bookService.getBookByISBN(book.ISBN);
    existingBook && existingBook.uuid == uuid
      ? (updatedData.ISBN = book.ISBN)
      : (updatedData.ISBN = book.ISBN);
  }
  if (
    book.language &&
    validator.isAlpha(book.language, "pt-BR", { ignore: " " })
  )
    updatedData.language = book.language;
  if (book.price && book.price > 0) updatedData.price = book.price;
  if (book.page_count && book.page_count > 0)
    updatedData.page_count = book.page_count;
  if (book.stock_quantity && book.stock_quantity >= 0)
    updatedData.stock_quantity = book.stock_quantity;
  if (book.release_date) {
    const releaseDate = new Date(book.release_date);
    if (!isNaN(releaseDate.getTime())) updatedData.release_date = releaseDate;
  }

  return updatedData;
};
