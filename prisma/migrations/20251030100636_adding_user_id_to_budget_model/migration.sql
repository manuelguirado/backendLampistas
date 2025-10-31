/*
  Warnings:

  - Added the required column `userID` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workerID` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "userID" INTEGER NOT NULL,
ADD COLUMN     "workerID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
