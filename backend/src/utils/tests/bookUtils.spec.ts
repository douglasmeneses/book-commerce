import sharp from "sharp";
import { processImage, processBookImages, handleBookImage } from "../bookUtils";
import { Book } from "@prisma/client";
import { BookResponse } from "../../types/bookTypes";
import exp from "node:constants";

jest.mock("sharp");

const mockSharp = sharp as jest.Mocked<typeof sharp>;

describe("bookUtils", () => {
  describe("processImage", () => {
    it("should return null if imageBuffer is null", async () => {
      const result = await processImage(null);
      expect(result).toBeNull();
    });

    it("should process and return a base64 string for a valid image buffer", async () => {
      const mockBuffer = Buffer.from("mockImage");
      const mockCompressedBuffer = Buffer.from("compressedImage");
      (sharp as unknown as jest.Mock).mockReturnValue({
        resize: jest.fn().mockReturnThis(),
        jpeg: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(mockCompressedBuffer),
      });

      const result = await processImage(mockBuffer);
      expect(result).toBe(mockCompressedBuffer.toString("base64"));
    });
  });

  describe("processBookImages", () => {
    it("should process book images and return updated books", async () => {
      const mockBooks: BookResponse[] = [
        {
          uuid: "1",
          title: "Book 1",
          image: Buffer.from("image1").toString("base64"),
          image_url: null,
          authors: [],
          price: 19.99,
          synopsis: "A great book about programming.",
        },
        {
          uuid: "2",
          title: "Book 2",
          image: null,
          image_url: null,
          authors: [],
          price: 0,
          synopsis: "",
        },
      ];
      const mockCompressedBuffer = Buffer.from("compressedImage");
      (sharp as unknown as jest.Mock).mockReturnValue({
        resize: jest.fn().mockReturnThis(),
        jpeg: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(mockCompressedBuffer),
      });

      const result = await processBookImages(mockBooks);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            uuid: "1",
            title: "Book 1",
            image: `data:image/jpeg;base64,${mockCompressedBuffer.toString(
              "base64"
            )}`,
            image_url: null,
          }),
          expect.objectContaining({
            uuid: "2",
            title: "Book 2",
            image: null,
            image_url: null,
          }),
        ])
      );
    });
  });

  describe("handleBookImage", () => {
    it("should process a book with an image and return a BookResponse", async () => {
      const mockBook: Book = {
        id: 1,
        uuid: "123e4567-e89b-12d3-a456-426614174000",
        title: "Book 1",
        image: Buffer.from("image1"),
        image_url: null,
        synopsis: "A great book about programming.",
        language: "English",
        price: 19.99,
        ISBN: "1234567890",
        rating: 4.5,
        stock_quantity: 100,
        favorite_count: 0,
        page_count: 300,
        release_date: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
        updated_at: new Date("2023-01-01"),
      };

      const mockCompressedBuffer = Buffer.from("compressedImage");
      (sharp as unknown as jest.Mock).mockReturnValue({
        resize: jest.fn().mockReturnThis(),
        jpeg: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(mockCompressedBuffer),
      });

      const result = await handleBookImage(mockBook);
      expect(result).toEqual(
        expect.objectContaining({
          id: 1,
          title: "Book 1",
          image: `data:image/png;base64,${mockCompressedBuffer.toString(
            "base64"
          )}`,
          image_url: null,
          authors: [],
        })
      );
    });

    it("should return a BookResponse with null image if no image is provided", async () => {
      const mockBook: Book = {
        id: 2,
        uuid: "456e7890-e89b-12d3-a456-426614174001",
        title: "Book 2",
        image: null,
        image_url: null,
        synopsis: "",
        language: "English",
        price: 0,
        ISBN: "9876543210",
        rating: 0,
        stock_quantity: 0,
        favorite_count: 0,
        page_count: 0,
        release_date: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
        updated_at: new Date("2023-01-01"),
      };

      const result = await handleBookImage(mockBook);
      expect(result).toEqual(
        expect.objectContaining({
          id: 2,
          title: "Book 2",
          image: null,
          image_url: null,
          authors: [],
        })
      );
    });
  });
});
