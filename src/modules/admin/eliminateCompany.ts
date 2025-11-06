import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function eliminateCompany(companyID: number) {
  if (!companyID) {
    throw new Error('Company ID is required');
  }
  const company = await prisma.company.findUnique({
    where: { companyID: companyID },
  });
  if (!company) {
    throw new Error('Company not found');
  }
  await prisma.adminsCompanies.deleteMany({
    where: { companyID: companyID },
  });
  // Eliminar la compañía
  await prisma.company.delete({
    where: { companyID: companyID },
  });
  await prisma.directions.deleteMany({
    where: { companyID: companyID },
  });
  // Eliminar trabajadores asociados a la compañía
  await prisma.worker.deleteMany({
    where: { companyID: companyID },
  });
  try {
    const payload = { companyID: company.companyID, role: company.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return {
      message: 'Company and associated data deleted successfully',
      token,
    };
  } catch (error) {
    throw new Error(`Error generating token: ${error}`);
  }
}
