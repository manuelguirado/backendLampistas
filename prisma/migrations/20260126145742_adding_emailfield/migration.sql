/*
  Warnings:

  - You are about to drop the column `companyName` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `companyemail` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "companyName",
ADD COLUMN     "companyemail" VARCHAR(255) NOT NULL;
