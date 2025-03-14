/*
  Warnings:

  - You are about to drop the column `bookId` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_bookId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "bookId";
