/*
  Warnings:

  - Added the required column `machineType` to the `machinery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "machinery" ADD COLUMN     "machineType" TEXT NOT NULL;
