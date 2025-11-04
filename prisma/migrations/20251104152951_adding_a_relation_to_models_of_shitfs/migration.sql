/*
  Warnings:

  - Added the required column `shiftID` to the `ShiftWorker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftSchedule` to the `ShiftWorker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftType` to the `ShiftWorker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShiftWorker" ADD COLUMN     "shiftID" INTEGER NOT NULL,
ADD COLUMN     "shiftSchedule" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "shiftType" VARCHAR(50) NOT NULL;

-- AddForeignKey
ALTER TABLE "ShiftWorker" ADD CONSTRAINT "ShiftWorker_shiftID_fkey" FOREIGN KEY ("shiftID") REFERENCES "ShiftSchedule"("ShiftID") ON DELETE RESTRICT ON UPDATE CASCADE;
