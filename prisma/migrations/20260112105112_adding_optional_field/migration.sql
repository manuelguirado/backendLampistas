/*
  Warnings:

  - You are about to drop the column `workerID` on the `IncidentHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "IncidentHistory" DROP CONSTRAINT "IncidentHistory_workerID_fkey";

-- AlterTable
ALTER TABLE "IncidentHistory" DROP COLUMN "workerID",
ADD COLUMN     "workerWorkerid" INTEGER;

-- AddForeignKey
ALTER TABLE "IncidentHistory" ADD CONSTRAINT "IncidentHistory_workerWorkerid_fkey" FOREIGN KEY ("workerWorkerid") REFERENCES "Worker"("workerid") ON DELETE SET NULL ON UPDATE CASCADE;
