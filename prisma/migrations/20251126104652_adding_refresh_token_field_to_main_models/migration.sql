-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "refreshToken" TEXT;
