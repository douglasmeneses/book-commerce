import { PrismaClient } from "@prisma/client";
import { bookExists } from "../middlewares/bookValidators";
import { userExists } from "../middlewares/userValidators";

const prisma = new PrismaClient();

const favoriteService = {
  favoriteBook: async (book_uuid: string, user_uuid: string) => {
    try {
      const user = await userExists(user_uuid);
      if ("error" in user) {
        return { error: user.error };
      }

      const book = await bookExists(book_uuid);
      if ("error" in book) {
        return { error: book.error };
      }

      const favorite = await prisma.favorites.findFirst({
        where: { book_id: book.id, user_id: user.id },
      });

      if (!favorite) {
        const favorited = await prisma.favorites.create({
          data: {
            book_id: book.id,
            user_id: user.id,
          },
        });
        return favorited;
      } else {
        await prisma.favorites.delete({
          where: { user_id_book_id: { user_id: user.id, book_id: book.id } },
        });
        return;
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },
  getFavorites: async (user_uuid: string) => {},
};

export default favoriteService;
