import { PrismaClient } from "@prisma/client";
import { books } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  for (const book of books) {
    await prisma.book.create({
      data: {
        title: book.title,
        synopsis: book.synopsis,
        language: book.language,
        price: book.price,
        ISBN: book.ISBN,
        page_count: book.page_count,
        stock_quantity: book.stock_quantity || 0,
        image_url: book.image_url || "",
        release_date: new Date(book.release_date),
        stocks: {
          create: {
            quantity: book.stock_quantity || 0,
          },
        },
        authors: {
          create: book.authors.map((authorName) => ({
            author: {
              connectOrCreate: {
                where: { name: authorName },
                create: {
                  name: authorName,
                  bio: "",
                  year_of_birth: new Date(),
                  image: null,
                },
              },
            },
          })),
        },
        genres: {
          create: book.genres.map((genreName) => ({
            genre: {
              connectOrCreate: {
                where: { name: genreName },
                create: { name: genreName },
              },
            },
          })),
        },
        publishers: {
          create: book.publishers.map((publisherName) => ({
            publisher: {
              connectOrCreate: {
                where: { name: publisherName },
                create: { name: publisherName },
              },
            },
          })),
        },
      },
    });
  }

  console.log("Seed executado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
