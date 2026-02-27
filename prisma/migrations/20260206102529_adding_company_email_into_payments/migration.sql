/*
  Warnings:

  - Added the required column `companyEmail` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "companyEmail" VARCHAR(255) NOT NULL;
