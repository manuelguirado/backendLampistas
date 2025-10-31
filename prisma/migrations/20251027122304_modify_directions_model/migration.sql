-- DropForeignKey
ALTER TABLE "public"."Directions" DROP CONSTRAINT "Directions_userID_fkey";

-- AlterTable
ALTER TABLE "Directions" ADD COLUMN     "companyID" INTEGER,
ALTER COLUMN "userID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Directions" ADD CONSTRAINT "Directions_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directions" ADD CONSTRAINT "Directions_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE SET NULL ON UPDATE CASCADE;
