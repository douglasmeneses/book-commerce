import sharp from "sharp";

export const processAvatar = async (
  avatarBuffer: Buffer | null,
  width: number = 100,
  quality: number = 70
): Promise<string | null> => {
  if (!avatarBuffer) return null;

  const compressedAvatar = await sharp(avatarBuffer)
    .resize(width)
    .jpeg({ quality })
    .toBuffer();

  return Buffer.from(compressedAvatar).toString("base64");
};
