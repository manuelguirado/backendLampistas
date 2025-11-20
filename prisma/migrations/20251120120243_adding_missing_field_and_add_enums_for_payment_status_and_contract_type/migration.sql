/*
  Warnings:

  - Changed the type of `status` on the `paymentStatus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "paymentStatusEnum" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('contract', 'freeChoice');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "contractType" "ContractType";

-- AlterTable
ALTER TABLE "paymentStatus" DROP COLUMN "status",
ADD COLUMN     "status" "paymentStatusEnum" NOT NULL;
