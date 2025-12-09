-- AlterTable
ALTER TABLE "machinery" ALTER COLUMN "maintenanceDate" DROP NOT NULL,
ALTER COLUMN "lastInspectionDate" DROP NOT NULL,
ALTER COLUMN "installedAt" DROP NOT NULL;
