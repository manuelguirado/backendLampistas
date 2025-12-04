/*
  Warnings:

  - Added the required column `brand` to the `machinery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "machinery" ADD COLUMN     "brand" TEXT NOT NULL;
