-- CreateTable
CREATE TABLE "Recomendation" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,

    CONSTRAINT "Recomendation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recomendation" ADD CONSTRAINT "Recomendation_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recomendation" ADD CONSTRAINT "Recomendation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
