/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `companyID` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userID]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Admin" DROP CONSTRAINT "Admin_companyID_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "companyID",
DROP COLUMN "id",
ADD COLUMN     "adminID" SERIAL NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminID");

-- CreateTable
CREATE TABLE "AdminsCompanies" (
    "id" SERIAL NOT NULL,
    "adminID" INTEGER NOT NULL,
    "companyID" INTEGER NOT NULL,

    CONSTRAINT "AdminsCompanies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminsCompanies_adminID_companyID_key" ON "AdminsCompanies"("adminID", "companyID");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userID_key" ON "Company"("userID");

-- AddForeignKey
ALTER TABLE "AdminsCompanies" ADD CONSTRAINT "AdminsCompanies_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "Admin"("adminID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminsCompanies" ADD CONSTRAINT "AdminsCompanies_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE RESTRICT ON UPDATE CASCADE;
