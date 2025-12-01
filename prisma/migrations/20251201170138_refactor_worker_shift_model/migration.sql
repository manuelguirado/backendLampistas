/*
  Warnings:

  - You are about to drop the column `shiftSchedule` on the `ShiftWorker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShiftWorker" DROP COLUMN "shiftSchedule",
ADD COLUMN     "endDate" TIMESTAMP(6),
ADD COLUMN     "startDate" TIMESTAMP(6);
