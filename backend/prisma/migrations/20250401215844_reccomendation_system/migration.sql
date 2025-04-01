/*
  Warnings:

  - You are about to drop the column `user_id` on the `Recommendation` table. All the data in the column will be lost.
  - Added the required column `user_uuid` to the `Recommendation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Recommendation" DROP CONSTRAINT "Recommendation_user_id_fkey";

-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "image_url" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "Recommendation" DROP COLUMN "user_id",
ADD COLUMN     "user_uuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
