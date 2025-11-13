import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function editCompany(
  companyID: number,
  update: {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
  },
  adminID: number,
) {
  {
    if (!companyID) {
      throw new Error('Company ID is required');
    }
    if (Object.keys(update).length === 0) {
      throw new Error('At least one field to update must be provided');
    }

    const existingCompany = await prisma.company.findUnique({
      where: { companyID: companyID },
    });

    if (!existingCompany) {
      throw new Error('Company not found');
    }
    const checkRoleAdmin = await prisma.admin.findFirst({
      where: { adminID: adminID },
    });
    if (checkRoleAdmin?.role !== 'ADMIN') {
      throw new Error('Unauthorized - Invalid role');
    }
    const updatedCompany = await prisma.company.update({
      where: { companyID: companyID },
      data: {
        ...update,
      },
    });
    try {
      const payload = {
        companyID: updatedCompany.companyID,
        role: updatedCompany.role,
      };
      const secret = process.env.JWT_SECRET as string;
      const options: SignOptions = { expiresIn: '1h' };
      const token = jwt.sign(payload, secret, options);
      return { token, ...updatedCompany, adminID };
    } catch (error: any) {
      console.error('Error generating token:', error);
      throw new Error('Error generating token');
    }
  }
}
