/*
  Warnings:

  - You are about to alter the column `rating` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(1,1)`.
  - The primary key for the `Stock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Stock` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_user_id_fkey";

-- DropForeignKey
ALTER TABLE "userAddress" DROP CONSTRAINT "userAddress_address_id_fkey";

-- DropForeignKey
ALTER TABLE "userAddress" DROP CONSTRAINT "userAddress_user_id_fkey";


ALTER TABLE "Review" ALTER COLUMN "rating" SET DEFAULT 0.0,
ALTER COLUMN "rating" SET DATA TYPE DECIMAL(1,1);

-- AlterTable
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Stock_pkey" PRIMARY KEY ("id");


-- -- CreateTable
-- CREATE TABLE "Address" (
--     "id" SERIAL NOT NULL,
--     "user_id" INTEGER NOT NULL,
--     "street" TEXT NOT NULL,
--     "number" TEXT NOT NULL,
--     "neighborhood" TEXT,
--     "complement" TEXT,
--     "city" TEXT NOT NULL,
--     "state" TEXT NOT NULL,
--     "zip_code" TEXT NOT NULL,
--     "country" TEXT NOT NULL,
--     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updated_at" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
-- );

-- CreateTable
-- CREATE TABLE "userAddress" (
--     "id" TEXT NOT NULL,
--     "user_id" INTEGER NOT NULL,
--     "address_id" INTEGER NOT NULL,
--     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updated_at" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "userAddress_pkey" PRIMARY KEY ("id")
-- );

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
