import { PrismaClient } from '../../../generated/prisma';
import { hashPassword } from '../../utils/hash/hashPassword';

const prisma = new PrismaClient();

interface CompanyDirections {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export async function registerCompany(
  name: string,
  phone: string,
  email: string,
  address: string,
  password: string,
  companyCode?: string,
  directions?: CompanyDirections,
) {
  if (!name || !phone || !address || !password) {
    throw new Error('Name, phone, address and password are required');
  }

  // Check if company with same name already exists (since there's no email field)
  const existingCompany = await prisma.company.findFirst({
    where: { name },
  });

  if (existingCompany) {
    throw new Error('Company with this name already exists');
  }

  const hashedPassword = await hashPassword(password);

  const company = await prisma.company.create({
    data: {
      name,
      address,
      email,
      phone,
      password: hashedPassword,
      companyCode,
      role: 'COMPANY',
    },
  });

  // Create directions if provided
  if (directions) {
    await prisma.directions.create({
      data: {
        address: directions.address,
        city: directions.city,
        state: directions.state,
        zipCode: directions.zipCode,
        companyID: company.companyID,
      },
    });
  }

  return company;
}
