/*
  Warnings:

  - Added the required column `companyCode` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyEmail` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workerCode` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "companyCode" VARCHAR(100) NOT NULL,
ADD COLUMN     "companyEmail" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userCode" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "workerCode" VARCHAR(100) NOT NULL;
