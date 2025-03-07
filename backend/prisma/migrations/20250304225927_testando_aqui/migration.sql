-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_book_id_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_book_id_fkey";

-- DropForeignKey
ALTER TABLE "bookAuthor" DROP CONSTRAINT "bookAuthor_book_id_fkey";

-- DropForeignKey
ALTER TABLE "bookGenre" DROP CONSTRAINT "bookGenre_book_id_fkey";

-- DropForeignKey
ALTER TABLE "bookPublisher" DROP CONSTRAINT "bookPublisher_book_id_fkey";

-- AddForeignKey
ALTER TABLE "bookGenre" ADD CONSTRAINT "bookGenre_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookAuthor" ADD CONSTRAINT "bookAuthor_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookPublisher" ADD CONSTRAINT "bookPublisher_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
