/*
  Warnings:

  - Added the required column `ammount` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "paymentStatusEnum" ADD VALUE 'STARTED';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ammount" DECIMAL(10,2) NOT NULL;
