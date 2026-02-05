-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "companyID" INTEGER NOT NULL,
    "stripeProductID" VARCHAR(255) NOT NULL,
    "priceID" INTEGER NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_stripeProductID_key" ON "products"("stripeProductID");

-- CreateIndex
CREATE UNIQUE INDEX "products_priceID_key" ON "products"("priceID");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE RESTRICT ON UPDATE CASCADE;
