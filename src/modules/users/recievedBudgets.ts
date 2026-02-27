import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function recievedBudgets(
  userID: number,
  limit: number = 5,
  offset: number = 0,
) {
  if (!userID) {
    throw new Error('userID is required');
  }

  const user = await prisma.user.findUnique({
    where: { userID: userID },
  });
  if (!user) {
    throw new Error('User does not exist');
  }

  // Obtener el total de presupuestos
  const totalBudgets = await prisma.budget.count({
    where: { userID: userID, paid: false },
  });

  const budgets = await prisma.budget.findMany({
    where: { userID: userID, paid: false },
    take: limit,
    skip: offset,
    orderBy: { budgetID: 'desc' },
  });

  if (!budgets) {
    return [];
  }
  const mappedBudgets = budgets.map((budget) => {
    return {
      budgetID: budget.budgetID,
      title: budget.title,
      incidentID: budget.incidentID ?? 0,
      createdAt: budget.createdAt,
      totalAmount:
        typeof budget.totalAmount === 'object' &&
        'toNumber' in budget.totalAmount
          ? budget.totalAmount.toNumber()
          : budget.totalAmount,
      description: budget.description ?? '',
      items: budget.items,
    };
  });
  try {
    const payload = { userID: user.userID, role: user.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, budgets: mappedBudgets, total: totalBudgets };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
