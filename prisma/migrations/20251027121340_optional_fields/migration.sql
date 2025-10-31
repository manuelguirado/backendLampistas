-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "companyCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Worker" ALTER COLUMN "workerCode" DROP NOT NULL;
