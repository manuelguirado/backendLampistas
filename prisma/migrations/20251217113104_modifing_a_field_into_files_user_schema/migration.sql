/*
  Warnings:

  - You are about to drop the column `filURL` on the `companyFiles` table. All the data in the column will be lost.
  - You are about to drop the column `filURL` on the `userFiles` table. All the data in the column will be lost.
  - You are about to drop the column `filURL` on the `workerFiles` table. All the data in the column will be lost.
  - Added the required column `fileURL` to the `companyFiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileURL` to the `userFiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileURL` to the `workerFiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companyFiles" DROP COLUMN "filURL",
ADD COLUMN     "fileURL" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "userFiles" DROP COLUMN "filURL",
ADD COLUMN     "fileURL" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "workerFiles" DROP COLUMN "filURL",
ADD COLUMN     "fileURL" VARCHAR(255) NOT NULL;
