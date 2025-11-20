/*
  Warnings:

  - You are about to drop the column `contractType` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "contractType";

-- CreateTable
CREATE TABLE "contracts" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "companyID" INTEGER NOT NULL,
    "contractType" "ContractType",
    "startDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(6),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contracts_userID_isActive_idx" ON "contracts"("userID", "isActive");

-- CreateIndex
CREATE INDEX "contracts_companyID_isActive_idx" ON "contracts"("companyID", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_userID_companyID_contractType_key" ON "contracts"("userID", "companyID", "contractType");

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE RESTRICT ON UPDATE CASCADE;
