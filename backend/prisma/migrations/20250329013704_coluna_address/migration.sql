-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_user_id_fkey";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00;
