/*
  Warnings:

  - The `status` column on the `Incidents` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "incidentStatus" AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- AlterTable
ALTER TABLE "Incidents" DROP COLUMN "status",
ADD COLUMN     "status" "incidentStatus" NOT NULL DEFAULT 'open';
