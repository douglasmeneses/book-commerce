-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "image_url" TEXT DEFAULT '';


