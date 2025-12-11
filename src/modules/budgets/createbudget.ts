import { PrismaClient } from '../../../generated/prisma';
import type { ItemType } from '../../utils/types/itemType';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function createBudget(
  budgetNumber: string,
  userID: number,
  companyID: number,
  title: string,
  items: ItemType[],
  subtotal: number,
  tax: number,
  totalAmount: number,
  incidentID?: number,
  description?: string,
) {
  if (!budgetNumber || !userID || !companyID || !items || items.length === 0) {
    throw new Error('Budget number, user, company and items are required');
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

  if (incidentID) {
    const foundIncident = await prisma.incidents.findUnique({
      where: { IncidentsID: incidentID },
    });

    if (!foundIncident) {
      throw new Error('Incident not found');
    }
  }

  const budget = await prisma.budget.create({
    data: {
      budgetNumber,
      userID,
      companyID,
      title,
      items: items,
      subtotal,
      tax,
      totalAmount,
      incidentID: incidentID || null,
      description,
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
    return {
      token,
      budget: {
        ...budget,
        items: budget.items as ItemType[],
      },
    };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
