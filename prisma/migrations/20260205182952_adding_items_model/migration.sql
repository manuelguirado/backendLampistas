-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "productID" INTEGER NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_productID_fkey" FOREIGN KEY ("productID") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
