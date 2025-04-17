import sharp from "sharp";
import { Book } from "@prisma/client";
import { BookResponse } from "../types/bookTypes";
import { Decimal } from "@prisma/client/runtime/library";

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

export const processBookImages = async (
  books: Book[]
): Promise<BookResponse[]> => {
  return Promise.all(
    books.map(async (book: Book) => {
      if (book.image) {
        const compressedImage = (book.image = await sharp(book.image)
          .resize(100)
          .jpeg({ quality: 70 })
          .toBuffer());

        const imageBase64 = compressedImage
          ? Buffer.from(compressedImage).toString("base64")
          : null;
        return {
          ...book,
          image: `data:image/png;base64,${imageBase64}`,
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
    };
  } else {
    bookResponse = {
      ...book,
      image: null,
    };
  }

  return bookResponse;
};
