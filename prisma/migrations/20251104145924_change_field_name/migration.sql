/*
  Warnings:

  - You are about to drop the column `shiftDate` on the `ShiftSchedule` table. All the data in the column will be lost.
  - Added the required column `shiftSchedule` to the `ShiftSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShiftSchedule" DROP COLUMN "shiftDate",
ADD COLUMN     "shiftSchedule" TIMESTAMP(6) NOT NULL;
