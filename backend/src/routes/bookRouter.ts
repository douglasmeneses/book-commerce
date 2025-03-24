import bookController from "../controllers/bookController";
import { Request, Response } from "express";
import { Router } from "express";
import upload from "../middlewares/upload";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/", authMiddleware, (req: Request, res: Response) => {
  bookController.registerBook(req, res);
});

router.get("/", (req: Request, res: Response) => {
  bookController.getBooks(req, res);
});

router.get("/:uuid", (req: Request, res: Response) => {
  bookController.getBookByUUID(req, res);
});

router.put("/:uuid", authMiddleware, (req: Request, res: Response) => {
  bookController.bookUpdate(req, res);
});

router.delete("/:uuid", authMiddleware, (req: Request, res: Response) => {
  bookController.bookDelete(req, res);
});

router.put(
  "/:uuid/upload",
  authMiddleware,
  upload.single("image"),
  (req: Request, res: Response) => {
    bookController.uploadBookImage(req, res);
  }
);
export default router;
