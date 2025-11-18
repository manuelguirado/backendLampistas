import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function listCompany(
  adminID: number,
  limit: number = 5,
  offset: number = 0,
) {
  if (!adminID) {
    throw new Error('adminID is required');
  }

  const admin = await prisma.admin.findUnique({
    where: { adminID: adminID },
  });

  if (!admin) {
    throw new Error('Admin does not exist');
  }

  // Obtener el total de compañías
  const totalCompanies = await prisma.company.count();

  const companies = await prisma.company.findMany({
    include: {
      directions: true,
    },
    take: limit,
    skip: offset,
    orderBy: { companyID: 'desc' },
  });

  if (!companies) {
    return [];
  }

  const mappedCompanies = companies.map((company) => {
    return {
      companyID: company.companyID,
      name: company.name,
      email: company.email,
      phone: company.phone,
      suspended: company.suspended,
      directions: company.directions[0] || null,
    };
  });

  try {
    const payload = { adminID: admin.adminID, role: admin.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, companies: mappedCompanies, total: totalCompanies };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
