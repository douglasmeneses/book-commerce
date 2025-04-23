/*
  Warnings:

  - You are about to drop the column `user_id` on the `Address` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `created_at` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `OrderItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,address_id]` on the table `userAddress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cart_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'BOLETO', 'PIX');

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "user_id",
ALTER COLUMN "country" SET DEFAULT 'Brasil';

-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "image" DROP NOT NULL;


-- AlterTable
ALTER TABLE "Credit_card" ADD COLUMN     "is_default" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address_id" INTEGER NOT NULL,
ADD COLUMN     "cart_id" INTEGER NOT NULL,
ADD COLUMN     "credit_card_number" TEXT,
ADD COLUMN     "credit_card_user_id" INTEGER,
ADD COLUMN     "payment" "PaymentMethod" NOT NULL,
ADD COLUMN     "shipping" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "total_price" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" SET DATA TYPE DECIMAL(2,1);

-- AlterTable
ALTER TABLE "userAddress" ADD COLUMN     "is_default" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "label" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "userAddress_user_id_address_id_key" ON "userAddress"("user_id", "address_id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_credit_card_user_id_credit_card_number_fkey" FOREIGN KEY ("credit_card_user_id", "credit_card_number") REFERENCES "Credit_card"("user_id", "number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
