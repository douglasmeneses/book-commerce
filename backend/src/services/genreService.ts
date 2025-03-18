import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateGenres = async (id: number, genres?: string[]) => {
  if (!genres) return;
  await prisma.bookGenre.deleteMany({
    where: { book_id: id },
  });

  for (const genreName of genres) {
    let genre = await prisma.genre.findFirst({
      where: { name: genreName },
    });
    if (!genre) {
      genre = await prisma.genre.create({
        data: {
          name: genreName,
        },
      });
    }
    await prisma.bookGenre.create({
      data: {
        genre_id: genre.id,
        book_id: id,
      },
    });
  }
};
