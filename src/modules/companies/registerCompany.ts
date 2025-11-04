import { PrismaClient } from '../../../generated/prisma';
import { hashPassword } from '../../utils/hash/hashPassword';
const prisma = new PrismaClient();
export async function registerCompany(
  name: string,
  phone: string,
  email: string,
  password: string,
  admin: number,
  directions: { address: string; city: string; state: string; zipCode: string },
) {
  if (!name || !phone || !password || !directions) {
    throw new Error('Name, phone, password and directions are required');
  }

  // Check if company with same name already exists (since there's no email field)
  const existingCompany = await prisma.company.findFirst({
    where: { name },
  });
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error('Email is already associated with another account');
  }
  if (existingCompany) {
    throw new Error('Company with this name already exists');
  }
  const existingAdmin = await prisma.admin.findUnique({
    where: { adminID: admin },
  });
  if (!existingAdmin) {
    throw new Error('Admin does not exist');
  }
  const hashedPassword = await hashPassword(password);
  const company = await prisma.company.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'COMPANY',
    },
  });
  const companyAdmin = await prisma.admin.findUnique({
    where: { adminID: admin },
  });
  if (!companyAdmin) {
    throw new Error('Admin does not exist');
  }
  await prisma.adminsCompanies.create({
    data: {
      Admin: { connect: { adminID: admin } },
      Company: { connect: { companyID: company.companyID } },
    },
  });

  await prisma.company.update({
    where: { companyID: company.companyID },
    data: {
      admins: {
        connect: [
          {
            adminID_companyID: { adminID: admin, companyID: company.companyID },
          },
        ],
      },
    },
  });

  await prisma.directions.create({
    data: {
      address: directions.address,
      city: directions.city,
      state: directions.state,
      zipCode: directions.zipCode,
      company: { connect: { companyID: company.companyID } },
    },
  });
  return company;
}
