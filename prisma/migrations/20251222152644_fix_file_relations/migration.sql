/*
  Warnings:

  - You are about to drop the `companyFiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userFiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workerFiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "companyFiles" DROP CONSTRAINT "companyFiles_companyID_fkey";

-- DropForeignKey
ALTER TABLE "companyFiles" DROP CONSTRAINT "companyFiles_incidentID_fkey";

-- DropForeignKey
ALTER TABLE "userFiles" DROP CONSTRAINT "userFiles_incidentID_fkey";

-- DropForeignKey
ALTER TABLE "userFiles" DROP CONSTRAINT "userFiles_userID_fkey";

-- DropForeignKey
ALTER TABLE "workerFiles" DROP CONSTRAINT "workerFiles_incidentID_fkey";

-- DropForeignKey
ALTER TABLE "workerFiles" DROP CONSTRAINT "workerFiles_workerID_fkey";

-- DropTable
DROP TABLE "companyFiles";

-- DropTable
DROP TABLE "userFiles";

-- DropTable
DROP TABLE "workerFiles";

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "objectKey" TEXT NOT NULL,
    "fileURL" VARCHAR(255) NOT NULL,
    "incidentID" INTEGER,
    "ownerType" "Role" NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "userID" INTEGER,
    "companyID" INTEGER,
    "workerID" INTEGER,
    "adminID" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_objectKey_key" ON "File"("objectKey");

-- CreateIndex
CREATE INDEX "File_ownerType_ownerId_idx" ON "File"("ownerType", "ownerId");

-- CreateIndex
CREATE INDEX "File_incidentID_idx" ON "File"("incidentID");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_incidentID_fkey" FOREIGN KEY ("incidentID") REFERENCES "Incidents"("IncidentsID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_workerID_fkey" FOREIGN KEY ("workerID") REFERENCES "Worker"("workerid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "Admin"("adminID") ON DELETE SET NULL ON UPDATE CASCADE;
