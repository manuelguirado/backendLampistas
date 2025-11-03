-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "suspended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "suspendedUntil" TIMESTAMP(3);
