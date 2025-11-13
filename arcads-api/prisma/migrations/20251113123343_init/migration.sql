-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'LAND');

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "transactionNetValue" DOUBLE PRECISION NOT NULL,
    "transactionCost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);
