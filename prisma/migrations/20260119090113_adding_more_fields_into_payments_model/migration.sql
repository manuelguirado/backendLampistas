/*
  Warnings:

  - Added the required column `cardBrand` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientEmail` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "cardBrand" VARCHAR(50) NOT NULL,
ADD COLUMN     "clientEmail" VARCHAR(255) NOT NULL;
