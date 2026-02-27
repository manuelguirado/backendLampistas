/*
  Warnings:

  - You are about to drop the column `method` on the `Payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentID]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentID` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_receivedByID_fkey";

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "method",
ADD COLUMN     "paymentID" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payments_paymentID_key" ON "Payments"("paymentID");
