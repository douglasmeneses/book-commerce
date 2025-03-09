/*
  Warnings:

  - Added the required column `stock_quantity` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_book_id_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_book_id_fkey";

-- DropForeignKey
ALTER TABLE "bookAuthor" DROP CONSTRAINT "bookAuthor_author_id_fkey";

-- DropForeignKey
ALTER TABLE "bookGenre" DROP CONSTRAINT "bookGenre_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "bookPublisher" DROP CONSTRAINT "bookPublisher_publisher_id_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "stock_quantity" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "bookGenre" ADD CONSTRAINT "bookGenre_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookAuthor" ADD CONSTRAINT "bookAuthor_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookPublisher" ADD CONSTRAINT "bookPublisher_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publisher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
