import { Response, Request } from "express";
import favoriteService from "../services/favoriteService";
import { stringify } from "querystring";

const favoriteController = {
  favoriteBook: async (req: Request, res: Response) => {
    try {
      const book_uuid = req.params.book_uuid;
      const user_uuid = req.body.user_uuid;

      const favorite = await favoriteService.favoriteBook(book_uuid, user_uuid);

      if (favorite && "error" in favorite) {
        return res.status(404).json({ error: favorite.error });
      }
      return res
        .status(200)
        .json({ message: favorite ? "Book favorited" : "Book unfavorited" });
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "internal erro",
      });
    }
  },
  getFavorites: async (req: Request, res: Response) => {},
};

export default favoriteController;
