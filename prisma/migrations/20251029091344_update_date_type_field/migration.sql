/*
  Warnings:

  - The `priority` column on the `Incidents` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Incidents" DROP COLUMN "priority",
ADD COLUMN     "priority" BOOLEAN NOT NULL DEFAULT false;
