/*
  Warnings:

  - The primary key for the `Budget` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Budget` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Company" DROP CONSTRAINT "Company_budgetID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Incidents" DROP CONSTRAINT "Incidents_budgetID_fkey";

-- AlterTable
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_pkey",
DROP COLUMN "id",
ADD COLUMN     "budgetID" SERIAL NOT NULL,
ADD CONSTRAINT "Budget_pkey" PRIMARY KEY ("budgetID");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_budgetID_fkey" FOREIGN KEY ("budgetID") REFERENCES "Budget"("budgetID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidents" ADD CONSTRAINT "Incidents_budgetID_fkey" FOREIGN KEY ("budgetID") REFERENCES "Budget"("budgetID") ON DELETE SET NULL ON UPDATE CASCADE;
