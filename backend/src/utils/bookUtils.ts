import sharp from "sharp";
import { Book } from "@prisma/client";
import { ProcessedBook } from "../types/bookTypes";

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
): Promise<ProcessedBook[]> => {
  return Promise.all(
    books.map(async (book: Book) => {
      const compressedImage = book.image
        ? await sharp(book.image).resize(100).jpeg({ quality: 70 }).toBuffer()
        : null;

      const imageBase64 = compressedImage
        ? Buffer.from(compressedImage).toString("base64")
        : null;

      return {
        ...book,
        image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null,
      };
    })
  );
};
