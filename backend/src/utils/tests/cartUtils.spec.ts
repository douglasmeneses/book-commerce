import sharp from "sharp";
import { processCartItems } from "../cartUtils";
import { CartItemRequest } from "../../types/cartTypes";
import { Decimal } from "@prisma/client/runtime/library";

const mockSharpInstance = {
  resize: jest.fn().mockReturnThis(),
  jpeg: jest.fn().mockReturnThis(),
  toBuffer: jest.fn().mockResolvedValue(Buffer.from("compressedImage")),
};

jest.mock("sharp", () => {
  return jest.fn(() => mockSharpInstance);
});

describe("processCartItems", () => {
  it("should process cart items with images and return base64 encoded images", async () => {
    const mockCartItems: CartItemRequest[] = [
      {
        id: 1,
        cart_id: 1,
        book_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        price: new Decimal(10.99),
        quantity: 1,
        book: {
          id: 1,
          title: "Mock Book",
          price: 10.99,
          image: Buffer.from("mockImageData"),
          image_url: null,
        },
      },
    ];

    const mockSharpInstance = {
      resize: jest.fn().mockReturnThis(),
      jpeg: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(Buffer.from("compressedImage")),
    };

    (sharp as unknown as jest.Mock).mockImplementation(() => mockSharpInstance);

    const result = await processCartItems(mockCartItems);

    expect(sharp).toHaveBeenCalledWith(Buffer.from("mockImageData"));
    expect(mockSharpInstance.resize).toHaveBeenCalledWith(100);
    expect(mockSharpInstance.jpeg).toHaveBeenCalledWith({ quality: 70 });
    expect(result).toMatchObject([
      expect.objectContaining({
        book: expect.objectContaining({
          image: "data:image/png;base64,Y29tcHJlc3NlZEltYWdl",
          image_url: null,
        }),
      }),
    ]);
  });

  it("should process cart items without images and set image to null", async () => {
    const mockCartItems: CartItemRequest[] = [
      {
        id: 1,
        cart_id: 1,
        book_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        price: new Decimal(10.99),
        quantity: 1,
        book: {
          id: 1,
          title: "Mock Book",
          price: 10.99,
          image: null,
          image_url: null,
        },
      },
    ];

    const result = await processCartItems(mockCartItems);

    expect(result).toMatchObject([
      {
        book: {
          image: null,
        },
      },
    ]);
  });
});
