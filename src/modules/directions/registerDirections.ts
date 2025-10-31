import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
export async function registerDirections(
  address: string,
  city: string,
  state: string,
  zipCode: string,
) {
  if (!address || !city || !state || !zipCode) {
    throw new Error('All direction fields are required');
  }

  return await prisma.directions.create({
    data: {
      address,
      city,
      state,
      zipCode,
    },
  });
}
