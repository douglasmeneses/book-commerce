import sharp from "sharp";

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
