-- CreateTable
CREATE TABLE "userFiles" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "filURL" VARCHAR(255) NOT NULL,
    "objectKey" VARCHAR(255) NOT NULL,
    "fileType" VARCHAR(100) NOT NULL,
    "uploadedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workerFiles" (
    "id" SERIAL NOT NULL,
    "workerID" INTEGER NOT NULL,
    "filURL" VARCHAR(255) NOT NULL,
    "objectKey" VARCHAR(255) NOT NULL,
    "fileType" VARCHAR(100) NOT NULL,
    "uploadedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workerFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companyFiles" (
    "id" SERIAL NOT NULL,
    "companyID" INTEGER NOT NULL,
    "filURL" VARCHAR(255) NOT NULL,
    "objectKey" VARCHAR(255) NOT NULL,
    "fileType" VARCHAR(100) NOT NULL,
    "uploadedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companyFiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userFiles" ADD CONSTRAINT "userFiles_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workerFiles" ADD CONSTRAINT "workerFiles_workerID_fkey" FOREIGN KEY ("workerID") REFERENCES "Worker"("workerid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companyFiles" ADD CONSTRAINT "companyFiles_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE RESTRICT ON UPDATE CASCADE;
