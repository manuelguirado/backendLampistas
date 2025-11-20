-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_userID_fkey";

-- AlterTable
ALTER TABLE "contracts" ALTER COLUMN "userID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;
