import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updatePublishers = async (id: number, publishers?: string[]) => {
  if (!publishers) return;
  await prisma.bookPublisher.deleteMany({
    where: { book_id: id },
  });

  for (const publisherName of publishers) {
    let publisher = await prisma.publisher.findFirst({
      where: { name: publisherName },
    });
    if (!publisher) {
      publisher = await prisma.publisher.create({
        data: {
          name: publisherName,
        },
      });
    }
    await prisma.bookPublisher.create({
      data: {
        publisher_id: publisher.id,
        book_id: id,
      },
    });
  }
};
