import { PrismaClient } from "@prisma/client";
import { bookExists } from "../middlewares/bookValidators";
import { handleError } from "../utils/bookUtils";

const prisma = new PrismaClient();

export const bookImageService = {
  async uploadBookImage(uuid: string, imageBuffer: Buffer) {
    try {
      const book = await bookExists(uuid);
      if (book && "error" in book) return { error: book.error };

      const updatedBook = await prisma.book.update({
        where: { uuid },
        data: { image: imageBuffer },
      });

      return updatedBook;
    } catch (error) {
      return handleError(error);
    }
  },
};
