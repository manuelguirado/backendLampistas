import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function activateCompany(companyID: number) {
  if (!companyID) {
    throw new Error('Company ID is required');
  }
  const activatedCompany = await prisma.company.update({
    where: { companyID: companyID },
    data: {
      suspended: false,
      suspendedUntil: null,
    },
  });
  try {
    const payload = {
      companyID: activatedCompany.companyID,
      role: activatedCompany.role,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...activatedCompany };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
