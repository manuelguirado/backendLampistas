/*
  Warnings:

  - The primary key for the `Worker` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Worker` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Incidents" DROP CONSTRAINT "Incidents_assignedWorkerID_fkey";

-- DropForeignKey
ALTER TABLE "public"."JobHistory" DROP CONSTRAINT "JobHistory_workerID_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShiftSchedule" DROP CONSTRAINT "ShiftSchedule_workerID_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShiftWorker" DROP CONSTRAINT "ShiftWorker_workerID_fkey";

-- AlterTable
ALTER TABLE "Incidents" ADD COLUMN     "urgency" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Worker" DROP CONSTRAINT "Worker_pkey",
DROP COLUMN "id",
ADD COLUMN     "workerid" SERIAL NOT NULL,
ADD CONSTRAINT "Worker_pkey" PRIMARY KEY ("workerid");

-- AddForeignKey
ALTER TABLE "Incidents" ADD CONSTRAINT "Incidents_assignedWorkerID_fkey" FOREIGN KEY ("assignedWorkerID") REFERENCES "Worker"("workerid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftWorker" ADD CONSTRAINT "ShiftWorker_workerID_fkey" FOREIGN KEY ("workerID") REFERENCES "Worker"("workerid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobHistory" ADD CONSTRAINT "JobHistory_workerID_fkey" FOREIGN KEY ("workerID") REFERENCES "Worker"("workerid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftSchedule" ADD CONSTRAINT "ShiftSchedule_workerID_fkey" FOREIGN KEY ("workerID") REFERENCES "Worker"("workerid") ON DELETE RESTRICT ON UPDATE CASCADE;
