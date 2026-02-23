import jwt, { SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
export async function hireCompany(userID: number, companyEmail: string) {
  try {
    if (!userID) throw new Error('User ID is required');
    const user = await prisma.user.findUnique({
      where: { userID },
    });
    if (!user) throw new Error('User not found');
    const userDirection = await prisma.directions.findFirst({
      where: { userID },
    });
    if (!userDirection) throw new Error('User direction not found');

    const company = await prisma.company.findFirst({
      where: { email: companyEmail },
    });
    if (!company) throw new Error('Company not found');

    const assignCompany = await prisma.user.update({
      where: { userID },
      data: {
        companyID: company.companyID,
      },
    });
    const contracts = await prisma.contracts.create({
      data: {
        userID,
        companyID: company.companyID,
        contractType: 'freeChoice',
      },
    });
    console.log('Company hired successfully:', assignCompany);
    const token = process.env.JWT_SECRET as string;
    const options: SignOptions = {
      expiresIn: '1h',
    };
    const payload = {
      userID: user.userID,
      companyID: company.companyID,
    };
    const newToken = jwt.sign(payload, token, options);
    return {
      message: 'Company hired successfully',
      token: newToken,
      assignCompany,
      contracts,
    };
  } catch (error) {
    console.error('Error hiring company:', error);
    throw new Error('Failed to hire company');
  }
}
