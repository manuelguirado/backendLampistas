-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "companyID" INTEGER;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE SET NULL ON UPDATE CASCADE;
