import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

export default async function saveProduct(
  name: string,
  description: string,
  price: number,
  currency: string,
  companyID: number,
  productID: string,
  priceID: string,
  items: { name: string; price: number; currency: string }[],
) {
  try {
    const product = await prisma.products.create({
      data: {
        name,
        description,
        price,
        currency,
        companyID,
        stripeProductID: productID,
        priceID,
        items: {
          create: [
            {
              name,
              price,
              currency,
            },
          ],
        },
      },
    });
    return product;
  } catch (error) {
    console.error('Error saving product:', error);
    throw error;
  }
}
