-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_companyID_fkey";

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "companyID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE SET NULL ON UPDATE CASCADE;
