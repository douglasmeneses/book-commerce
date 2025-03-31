-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "image_url" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00;
