/*
  Warnings:

  - The primary key for the `Author` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Author` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Genre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Genre` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Publisher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Publisher` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `bookGenre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `bookGenre` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `author_id` on the `bookAuthor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `genre_id` on the `bookGenre` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `publisher_id` on the `bookPublisher` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "bookAuthor" DROP CONSTRAINT "bookAuthor_author_id_fkey";

-- DropForeignKey
ALTER TABLE "bookGenre" DROP CONSTRAINT "bookGenre_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "bookPublisher" DROP CONSTRAINT "bookPublisher_publisher_id_fkey";

-- AlterTable
ALTER TABLE "Author" DROP CONSTRAINT "Author_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Author_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Genre" DROP CONSTRAINT "Genre_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Genre_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Publisher" DROP CONSTRAINT "Publisher_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "bookAuthor" DROP COLUMN "author_id",
ADD COLUMN     "author_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "bookGenre" DROP CONSTRAINT "bookGenre_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "genre_id",
ADD COLUMN     "genre_id" INTEGER NOT NULL,
ADD CONSTRAINT "bookGenre_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "bookPublisher" DROP COLUMN "publisher_id",
ADD COLUMN     "publisher_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "bookGenre" ADD CONSTRAINT "bookGenre_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookAuthor" ADD CONSTRAINT "bookAuthor_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookPublisher" ADD CONSTRAINT "bookPublisher_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
