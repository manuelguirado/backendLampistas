-- AlterTable
ALTER TABLE "companyFiles" ADD COLUMN     "incidentID" INTEGER;

-- AlterTable
ALTER TABLE "userFiles" ADD COLUMN     "incidentID" INTEGER;

-- AlterTable
ALTER TABLE "workerFiles" ADD COLUMN     "incidentID" INTEGER;

-- AddForeignKey
ALTER TABLE "userFiles" ADD CONSTRAINT "userFiles_incidentID_fkey" FOREIGN KEY ("incidentID") REFERENCES "Incidents"("IncidentsID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workerFiles" ADD CONSTRAINT "workerFiles_incidentID_fkey" FOREIGN KEY ("incidentID") REFERENCES "Incidents"("IncidentsID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companyFiles" ADD CONSTRAINT "companyFiles_incidentID_fkey" FOREIGN KEY ("incidentID") REFERENCES "Incidents"("IncidentsID") ON DELETE SET NULL ON UPDATE CASCADE;
