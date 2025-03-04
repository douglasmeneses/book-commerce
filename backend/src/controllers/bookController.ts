import bookService from "../services/bookService";
import Book from "@prisma/client";
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
        title: req.query.title as string,
        mostLiked: req.query.mostLiked === "true",
        mostRecent: req.query.mostRecent === "true",
      };

      const response = await bookService.getBooks(filter);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  },
  getBookById: async (req: Request, res: Response): Promise<Response> => {
    const uuid = req.params.uuid;
    try {
      const response = await bookService.getBookById(uuid);

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
    const updateBbook = req.body;
    try {
      const response = await bookService.updateBook(uuid, updateBbook);
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

  /**
     
    bookDelete: async (){},
    */
};

export default bookController;
