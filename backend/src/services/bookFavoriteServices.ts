import { PrismaClient } from "@prisma/client";
import { userExists } from "../middlewares/userValidators";
import { bookExists } from "../middlewares/bookValidators";
import { handleError } from "../utils/bookUtils";

const prisma = new PrismaClient();

export const bookFavoriteService = {
  async toggleFavorite(uuid: string, user_uuid: string) {
    try {
      const book = await bookExists(uuid);
      if (book && "error" in book) return { error: book.error };
      const user = await userExists(user_uuid);
      if (user && "error" in user) return { error: user.error };

      const favorite = await prisma.favorites.findFirst({
        where: { user_id: user.id, book_id: book.id },
      });

      if (!favorite) {
        await prisma.book.update({
          where: { id: book.id },
          data: { favorite_count: book.favorite_count - 1 },
        });
      } else {
        await prisma.book.update({
          where: { id: book.id },
          data: { favorite_count: book.favorite_count + 1 },
        });
      }
      return { success: true };
    } catch (error) {
      return handleError(error);
    }
  },
};
