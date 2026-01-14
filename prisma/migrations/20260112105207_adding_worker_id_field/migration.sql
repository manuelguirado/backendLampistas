/*
  Warnings:

  - You are about to drop the column `workerWorkerid` on the `IncidentHistory` table. All the data in the column will be lost.
  - Added the required column `workerID` to the `IncidentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IncidentHistory" DROP CONSTRAINT "IncidentHistory_workerWorkerid_fkey";

-- AlterTable
ALTER TABLE "IncidentHistory" DROP COLUMN "workerWorkerid",
ADD COLUMN     "workerID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "IncidentHistory" ADD CONSTRAINT "IncidentHistory_workerID_fkey" FOREIGN KEY ("workerID") REFERENCES "Worker"("workerid") ON DELETE RESTRICT ON UPDATE CASCADE;
