import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function companyUsers(companyID: number) {
  if (!companyID) {
    throw new Error('companyID is required');
  }
  const Company = await prisma.company.findUnique({
    where: { companyID },
  });

  if (!Company) {
    throw new Error('Company does not exist');
  }
  const users = await prisma.user.findMany({
    where: { companyID },
  });

  if (!users) {
    return [];
  }
  const mapUsers = users.map((user) => {
    return {
      userID: user.userID,
      email: user.email,
      name: user.name ?? '',
      companyID,
    };
  });
  try {
    const payload = { companyID: Company.companyID, role: Company.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, users: mapUsers };
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
}
