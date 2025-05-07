import { Response, Request } from "express";
import favoriteService from "../services/favoriteService";
import { BookResponseDTO } from "../dtos/booksDTOs";

const favoriteController = {
  favoriteBook: async (req: Request, res: Response) => {
    try {
      const book_uuid = req.params.book_uuid as string;
      const user_uuid = req.body.user_uuid as string;

      const favorite = await favoriteService.favoriteBook(book_uuid, user_uuid);

      if (favorite && typeof favorite === "object" && "error" in favorite) {
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
  getFavorites: async (req: Request, res: Response) => {
    try {
      const user_uuid = req.params.user_uuid;
      const favorites = await favoriteService.getFavorites(user_uuid);

      if (favorites && "error" in favorites) {
        return res.status(404).json({ error: favorites.error });
      }

      return res
        .status(200)
        .json(favorites.map((favorite) => new BookResponseDTO(favorite)));
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "internal erro",
      });
    }
  },
};

export default favoriteController;
