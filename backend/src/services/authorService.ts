import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateAuthors = async (id: number, authors?: string[]) => {
  if (!authors) return;
  await prisma.bookAuthor.deleteMany({
    where: { book_id: id },
  });

  for (const authorName of authors) {
    let author = await prisma.author.findFirst({
      where: { name: authorName },
    });
    if (!author) {
      author = await prisma.author.create({
        data: {
          name: authorName,
          bio: "",
          year_of_birth: new Date(),
          image: Buffer.alloc(0),
        },
      });
    }
    await prisma.bookAuthor.create({
      data: {
        author_id: author.id,
        book_id: id,
      },
    });
  }
};
