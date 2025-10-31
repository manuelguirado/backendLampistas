/*
  Warnings:

  - You are about to drop the column `companyEmail` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `companyID` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDate` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `amounts` on the `Budget` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Admin" DROP CONSTRAINT "Admin_companyID_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "companyEmail",
DROP COLUMN "companyID",
DROP COLUMN "paymentDate",
DROP COLUMN "subscriptionId";

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "amounts";
