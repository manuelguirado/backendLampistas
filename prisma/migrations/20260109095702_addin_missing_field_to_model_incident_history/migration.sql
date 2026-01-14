/*
  Warnings:

  - Added the required column `workerID` to the `IncidentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IncidentHistory" ADD COLUMN     "workerID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "IncidentHistory" ADD CONSTRAINT "IncidentHistory_workerID_fkey" FOREIGN KEY ("workerID") REFERENCES "Worker"("workerid") ON DELETE RESTRICT ON UPDATE CASCADE;
