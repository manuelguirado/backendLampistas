-- AlterTable
ALTER TABLE "File" ADD COLUMN     "budgetID" INTEGER;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_budgetID_fkey" FOREIGN KEY ("budgetID") REFERENCES "Budget"("budgetID") ON DELETE SET NULL ON UPDATE CASCADE;
