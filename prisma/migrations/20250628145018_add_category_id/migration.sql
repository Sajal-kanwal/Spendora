/*
  Warnings:

  - The required column `id` was added to the `Category` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "Category_name_userId_type_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MonthHistory" ALTER COLUMN "income" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "expense" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "upadateAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "YearHistory" ALTER COLUMN "income" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "expense" SET DATA TYPE DOUBLE PRECISION;
