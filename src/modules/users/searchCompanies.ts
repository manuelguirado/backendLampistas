import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
const prisma = new PrismaClient();
export async function searchCompanies(userID: number) {
  console.log('Searching companies for userID:', userID);
  try {
    if (!userID) throw new Error('User ID is required');
    const user = await prisma.user.findUnique({
      where: { userID },
      select: {
        directions: true,
      },
    });
    if (!user) throw new Error('User not found');
    const userDirection = user.directions[0];
    console.log('User direction:', userDirection);
    if (!userDirection) throw new Error('User direction not found');
    const companies = await prisma.company.findMany({
      where: {
        directions: {
          some: {
            city: userDirection.city,
            state: userDirection.state,
          },
        },
      },
      select: {
        companyID: true,
        name: true,
        email: true,
        phone: true,
        directions: true,
      },
    });

    console.log('Raw companies found:', companies);
    const mappedCompanies = companies.map((company) => ({
      companyID: company.companyID,
      name: company.name,
      email: company.email,
      phone: company.phone,
      directions: company.directions.map((dir) => ({
        address: dir.address,
        city: dir.city,
        state: dir.state,
        zipCode: dir.zipCode,
      })),
    }));
    console.log('Found companies:', mappedCompanies);
    const token = process.env.JWT_SECRET as string;
    const options: SignOptions = {
      expiresIn: '1h',
    };
    const payload = {
      userID,
    };
    const newToken = jwt.sign(payload, token, options);
    return { companies: mappedCompanies, token: newToken };
  } catch (error) {
    console.error('Error searching companies:', error);
    throw new Error('Failed to search companies');
  }
}
