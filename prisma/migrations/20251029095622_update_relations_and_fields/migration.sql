/*
  Warnings:

  - A unique constraint covering the columns `[budgetID]` on the table `Incidents` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "incidentID" INTEGER;

-- AlterTable
ALTER TABLE "Incidents" ALTER COLUMN "priority" DROP DEFAULT,
ALTER COLUMN "priority" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "IncidentsID" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Incidents_budgetID_key" ON "Incidents"("budgetID");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_IncidentsID_fkey" FOREIGN KEY ("IncidentsID") REFERENCES "Incidents"("IncidentsID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE RESTRICT ON UPDATE CASCADE;
