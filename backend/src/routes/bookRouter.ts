import bookController from "../controllers/bookController";
import { Request, Response } from "express";
import { Router } from "express";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  bookController.registerBook(req, res);
});

router.get("/", (req: Request, res: Response) => {
  bookController.getBooks(req, res);
});
export default router;
