/*
  Warnings:

  - The primary key for the `ShiftSchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ShiftSchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Incidents" ADD COLUMN     "workerID" INTEGER;

-- AlterTable
ALTER TABLE "ShiftSchedule" DROP CONSTRAINT "ShiftSchedule_pkey",
DROP COLUMN "id",
ADD COLUMN     "ShiftID" SERIAL NOT NULL,
ADD CONSTRAINT "ShiftSchedule_pkey" PRIMARY KEY ("ShiftID");
