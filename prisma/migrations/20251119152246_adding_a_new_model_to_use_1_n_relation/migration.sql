-- CreateTable
CREATE TABLE "workersCompanies" (
    "id" SERIAL NOT NULL,
    "workerID" INTEGER NOT NULL,
    "companyID" INTEGER NOT NULL,

    CONSTRAINT "workersCompanies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workersCompanies_workerID_companyID_key" ON "workersCompanies"("workerID", "companyID");

-- AddForeignKey
ALTER TABLE "workersCompanies" ADD CONSTRAINT "workersCompanies_workerID_fkey" FOREIGN KEY ("workerID") REFERENCES "Worker"("workerid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workersCompanies" ADD CONSTRAINT "workersCompanies_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE RESTRICT ON UPDATE CASCADE;
