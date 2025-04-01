-- CreateTable
CREATE TABLE "Recommendation" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
