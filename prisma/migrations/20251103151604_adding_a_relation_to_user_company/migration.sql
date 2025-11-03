-- DropForeignKey
ALTER TABLE "public"."Company" DROP CONSTRAINT "Company_userID_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE SET NULL ON UPDATE CASCADE;
