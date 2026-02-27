/*
  Warnings:

  - You are about to drop the column `location` on the `Incidents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Directions" ADD COLUMN     "incidentID" INTEGER;

-- AlterTable
ALTER TABLE "Incidents" DROP COLUMN "location";

-- AddForeignKey
ALTER TABLE "Directions" ADD CONSTRAINT "Directions_incidentID_fkey" FOREIGN KEY ("incidentID") REFERENCES "Incidents"("IncidentsID") ON DELETE SET NULL ON UPDATE CASCADE;
