/*
  Warnings:

  - Added the required column `companyID` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "companyID" INTEGER NOT NULL,
ADD COLUMN     "companyName" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE RESTRICT ON UPDATE CASCADE;
