/*
  Warnings:

  - The primary key for the `bookAuthor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `bookAuthor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `bookPublisher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `bookPublisher` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "bookAuthor" DROP CONSTRAINT "bookAuthor_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "bookAuthor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "bookPublisher" DROP CONSTRAINT "bookPublisher_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "bookPublisher_pkey" PRIMARY KEY ("id");
