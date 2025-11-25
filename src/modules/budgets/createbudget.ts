import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function createBudget(
  incidentID: number,
  amount: number,
  description: string,
  userID: number,
  companyID: number,
  items?: string[],
) {
  if (!incidentID || !amount || !description || !companyID || !userID) {
    throw new Error('All fields are required');
  }

  const foundIncident = await prisma.incidents.findUnique({
    where: { IncidentsID: incidentID },
  });
  if (!foundIncident) {
    throw new Error('Incident not found');
  }

  const foundCompany = await prisma.company.findUnique({
    where: { companyID },
  });
  if (!foundCompany) {
    throw new Error('Company not found');
  }

  const foundUser = await prisma.user.findUnique({
    where: { userID },
  });
  if (!foundUser) {
    throw new Error('User not found');
  }

  const item = items ? items.join(', ') : '';
  const budget = await prisma.budget.create({
    data: {
      incidentID,
      totalAmount: amount,
      description,
      userID: userID,
      companyID,
      items: item,
    },
  });

  try {
    const payload = {
      budgetID: budget.budgetID,
      companyID: companyID,
      role: foundCompany.role,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...budget };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
