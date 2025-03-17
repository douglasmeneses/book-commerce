import bookService from "../services/bookService";
import { Filter } from "../types/bookTypes";
import { Request, Response } from "express";

const bookController = {
  registerBook: async (req: Request, res: Response): Promise<Response> => {
    const user_id = req.body.user_id;
    const book = req.body.book;
    try {
      const response = await bookService.bookRegister(book, user_id);

      if ("error" in response) {
        return res.status(400).json({ error: response.error });
      }
      return res.status(201).json(response);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  },
  getBooks: async (req: Request, res: Response) => {
    try {
      const filter: Filter = {
        search: req.query.search as string,
        author: req.query.author as string,
        genre: req.query.genre as string,
        publisher: req.query.publisher as string,
        isbn: req.query.isbn as string,
        mostLiked: req.query.mostLiked === "true",
        mostRecent: req.query.mostRecent === "true",
        orderByPrice: req.query.orderByPrice as "asc" | "desc",
        minPrice: req.query.minPrice
          ? parseFloat(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseFloat(req.query.maxPrice as string)
          : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const response = await bookService.getBooks(filter);
      if ("error" in response) {
        return res.status(400).json({ error: response.error });
      }

      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  },
  getBookById: async (req: Request, res: Response): Promise<Response> => {
    const uuid = req.params.uuid;
    const user_uuid = req.query.user_uuid as string;

    try {
      const response = await bookService.getBookById(uuid, user_uuid);

      if (!response) {
        return res.status(404).json({ error: "Book not found" });
      }
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  },
  bookUpdate: async (req: Request, res: Response) => {
    const uuid = req.params.uuid;
    const user_uuid = req.body.user_uuid;
    const updateBook = req.body;
    try {
      const response = await bookService.updateBook(
        uuid,
        user_uuid,
        updateBook
      );
      if ("error" in response) {
        return res.status(400).json({ error: response.error });
      }
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  },
  bookDelete: async (req: Request, res: Response): Promise<Response> => {
    const uuid = req.params.uuid as string;
    const user_uuid = req.body.user_uuid as string;
    try {
      const response = await bookService.bookDelete(uuid, user_uuid);
      if ("error" in response) {
        return res.status(400).json({ error: response.error });
      }
      return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  },
};

export default bookController;
