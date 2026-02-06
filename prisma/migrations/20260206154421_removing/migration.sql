-- DropIndex
DROP INDEX "Payments_userID_key";

-- AlterTable
ALTER TABLE "Payments" ALTER COLUMN "companyEmail" SET DEFAULT '';
