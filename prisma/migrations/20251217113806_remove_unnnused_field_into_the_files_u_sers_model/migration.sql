/*
  Warnings:

  - You are about to drop the column `fileType` on the `companyFiles` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `userFiles` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `workerFiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companyFiles" DROP COLUMN "fileType";

-- AlterTable
ALTER TABLE "userFiles" DROP COLUMN "fileType";

-- AlterTable
ALTER TABLE "workerFiles" DROP COLUMN "fileType";
