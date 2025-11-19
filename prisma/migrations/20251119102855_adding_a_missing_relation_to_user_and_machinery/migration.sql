-- AlterTable
ALTER TABLE "User" ADD COLUMN     "machineryID" INTEGER;

-- CreateTable
CREATE TABLE "ClientMachinery" (
    "userID" INTEGER NOT NULL,
    "machineryID" INTEGER NOT NULL,

    CONSTRAINT "ClientMachinery_pkey" PRIMARY KEY ("userID","machineryID")
);

-- AddForeignKey
ALTER TABLE "ClientMachinery" ADD CONSTRAINT "ClientMachinery_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMachinery" ADD CONSTRAINT "ClientMachinery_machineryID_fkey" FOREIGN KEY ("machineryID") REFERENCES "machinery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
