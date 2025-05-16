import sharp from "sharp";
import { Book } from "@prisma/client";
import { BookResponse } from "../types/bookTypes";
import { Filter } from "../types/bookTypes";

export const processImage = async (
  imageBuffer: Buffer | null,
  width: number = 250,
  quality: number = 70
): Promise<string | null> => {
  if (!imageBuffer) return null;

  const compressedImage = await sharp(imageBuffer)
    .resize(width)
    .jpeg({ quality })
    .toBuffer();

  return Buffer.from(compressedImage).toString("base64");
};

export const processBookImages = async (books: BookResponse[]) => {
  return Promise.all(
    books.map(async (book: BookResponse) => {
      if (book.image) {
        const compressedImage = await sharp(book.image)
          .resize(100)
          .jpeg({ quality: 70 })
          .toBuffer();

        const imageBase64 = compressedImage
          ? Buffer.from(compressedImage).toString("base64")
          : null;

        return {
          ...book,
          image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null,
          image_url: null,
        };
      } else {
        return { ...book, image: null };
      }
    })
  );
};

export const handleBookImage = async (book: Book): Promise<BookResponse> => {
  let bookResponse: BookResponse;

  if (book.image) {
    const imageBase64 = await processImage(Buffer.from(book.image));
    bookResponse = {
      ...book,
      image: `data:image/png;base64,${imageBase64}`,
      image_url: null,
      authors: [],
    };
  } else {
    bookResponse = {
      ...book,
      image: null,
      authors: [],
    };
  }

  return bookResponse;
};

export const bookWhere = async (filter: Filter) => {
  const { search, author, genre, publisher, isbn, title, minPrice, maxPrice } =
    filter;
  console.log("Filter:", filter);

  const where: any = {
    OR: [
      { title: { contains: search, mode: "insensitive" } },
      { synopsis: { contains: search, mode: "insensitive" } },
      { ISBN: { contains: search, mode: "insensitive" } },
      { language: { contains: search, mode: "insensitive" } },
      {
        authors: {
          some: {
            author: { name: { contains: search, mode: "insensitive" } },
          },
        },
      },
      {
        genres: {
          some: {
            genre: { name: { contains: search, mode: "insensitive" } },
          },
        },
      },
      {
        publishers: {
          some: {
            publisher: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
      },
    ],
    price: {
      gte: minPrice,
      lte: maxPrice,
    },
  };

  if (author) {
    where.authors = {
      some: { author: { name: { contains: author, mode: "insensitive" } } },
    };
  }
  if (genre) {
    where.genres = {
      some: { genre: { name: { contains: genre, mode: "insensitive" } } },
    };
  }
  if (publisher) {
    where.publishers = {
      some: {
        publisher: { name: { contains: publisher, mode: "insensitive" } },
      },
    };
  }
  if (isbn) {
    where.ISBN = { contains: isbn, mode: "insensitive" };
  }
  if (title) {
    where.title = { contains: title, mode: "insensitive" };
  }

  return where;
};

export const handleError = (error: unknown) => {
  return {
    error: error instanceof Error ? error.message : "An unknown error occurred",
  };
};
