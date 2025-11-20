-- CreateTable
CREATE TABLE "usersCompanies" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "companyID" INTEGER NOT NULL,

    CONSTRAINT "usersCompanies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usersCompanies_userID_companyID_key" ON "usersCompanies"("userID", "companyID");

-- AddForeignKey
ALTER TABLE "usersCompanies" ADD CONSTRAINT "usersCompanies_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usersCompanies" ADD CONSTRAINT "usersCompanies_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE RESTRICT ON UPDATE CASCADE;
