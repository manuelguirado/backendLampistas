/*
  Warnings:

  - A unique constraint covering the columns `[incidentID]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `budgetNumber` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `items` on the `Budget` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "budgetNumber" VARCHAR(50) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "tax" DECIMAL(10,2) NOT NULL,
DROP COLUMN "items",
ADD COLUMN     "items" JSONB NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Budget_incidentID_key" ON "Budget"("incidentID");
