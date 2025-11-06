import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
const prisma = new PrismaClient();
export async function suspendCompany(companyID: number, suspendAt?: Date) {
  if (!companyID) {
    throw new Error('Company ID is required');
  }
  const suspendCompany = await prisma.company.update({
    where: { companyID: companyID },
    data: {
      suspended: true,
      suspendedUntil: suspendAt ?? null,
    },
  });
  try {
    const payload = {
      companyID: suspendCompany.companyID,
      role: suspendCompany.role,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...suspendCompany };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
