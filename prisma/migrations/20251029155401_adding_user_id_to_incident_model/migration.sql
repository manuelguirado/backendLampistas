/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Directions" DROP CONSTRAINT "Directions_userID_fkey";

-- DropForeignKey
ALTER TABLE "public"."IncidentHistory" DROP CONSTRAINT "IncidentHistory_userID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payments" DROP CONSTRAINT "Payments_userID_fkey";

-- DropForeignKey
ALTER TABLE "public"."machinery" DROP CONSTRAINT "machinery_clientID_fkey";

-- AlterTable
ALTER TABLE "Incidents" ADD COLUMN     "userID" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "userID" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userID");

-- AddForeignKey
ALTER TABLE "Incidents" ADD CONSTRAINT "Incidents_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentHistory" ADD CONSTRAINT "IncidentHistory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directions" ADD CONSTRAINT "Directions_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machinery" ADD CONSTRAINT "machinery_clientID_fkey" FOREIGN KEY ("clientID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
