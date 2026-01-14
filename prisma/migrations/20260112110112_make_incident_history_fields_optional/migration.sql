-- DropForeignKey
ALTER TABLE "IncidentHistory" DROP CONSTRAINT "IncidentHistory_companyID_fkey";

-- DropForeignKey
ALTER TABLE "IncidentHistory" DROP CONSTRAINT "IncidentHistory_userID_fkey";

-- DropForeignKey
ALTER TABLE "IncidentHistory" DROP CONSTRAINT "IncidentHistory_workerID_fkey";

-- AlterTable
ALTER TABLE "IncidentHistory" ALTER COLUMN "companyID" DROP NOT NULL,
ALTER COLUMN "userID" DROP NOT NULL,
ALTER COLUMN "workerID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "IncidentHistory" ADD CONSTRAINT "IncidentHistory_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentHistory" ADD CONSTRAINT "IncidentHistory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentHistory" ADD CONSTRAINT "IncidentHistory_workerID_fkey" FOREIGN KEY ("workerID") REFERENCES "Worker"("workerid") ON DELETE SET NULL ON UPDATE CASCADE;
