/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `machinery` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serialNumber` to the `machinery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "machinery" ADD COLUMN     "serialNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "machinery_serialNumber_key" ON "machinery"("serialNumber");
