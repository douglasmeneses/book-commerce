import sharp from "sharp";
import { processAvatar } from "../userUtils";

const mockSharpInstance = {
  resize: jest.fn().mockReturnThis(),
  jpeg: jest.fn().mockReturnThis(),
  toBuffer: jest.fn().mockResolvedValue(Buffer.from("compressedImage")),
};

jest.mock("sharp", () => {
  return jest.fn(() => mockSharpInstance);
});

describe("processAvatar", () => {
  it("should return null if avatarBuffer is null", async () => {
    const result = await processAvatar(null);
    expect(result).toBeNull();
  });

  it("should process the avatar and return a base64 string", async () => {
    const mockBuffer = Buffer.from("test");
    const mockCompressedBuffer = Buffer.from("compressed");
    const mockSharpInstance = {
      resize: jest.fn().mockReturnThis(),
      jpeg: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(mockCompressedBuffer),
    };

    (sharp as unknown as jest.Mock).mockReturnValue(mockSharpInstance);

    const result = await processAvatar(mockBuffer, 150, 80);

    expect(sharp).toHaveBeenCalledWith(mockBuffer);
    expect(mockSharpInstance.resize).toHaveBeenCalledWith(150);
    expect(mockSharpInstance.jpeg).toHaveBeenCalledWith({ quality: 80 });
    expect(mockSharpInstance.toBuffer).toHaveBeenCalled();
    expect(result).toBe(mockCompressedBuffer.toString("base64"));
  });

  it("should use default width and quality if not provided", async () => {
    const mockBuffer = Buffer.from("test");
    const mockCompressedBuffer = Buffer.from("compressed");
    const mockSharpInstance = {
      resize: jest.fn().mockReturnThis(),
      jpeg: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(mockCompressedBuffer),
    };

    (sharp as unknown as jest.Mock).mockReturnValue(mockSharpInstance);

    const result = await processAvatar(mockBuffer);

    expect(mockSharpInstance.resize).toHaveBeenCalledWith(100); // Default width
    expect(mockSharpInstance.jpeg).toHaveBeenCalledWith({ quality: 70 }); // Default quality
    expect(result).toBe(mockCompressedBuffer.toString("base64"));
  });

  it("should throw an error if sharp fails", async () => {
    const mockBuffer = Buffer.from("test");
    const mockSharpInstance = {
      resize: jest.fn().mockReturnThis(),
      jpeg: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockRejectedValue(new Error("Sharp error")),
    };

    (sharp as unknown as jest.Mock).mockReturnValue(mockSharpInstance);

    await expect(processAvatar(mockBuffer)).rejects.toThrow("Sharp error");
  });
});
