import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function getClientContracts(companyID: number, userID: number) {
  if (!companyID || !userID) {
    throw new Error('companyID and userID are required');
  }
  const company = await prisma.company.findUnique({
    where: { companyID },
  });
  const user = await prisma.user.findUnique({
    where: { userID },
  });

  if (!user) {
    throw new Error('User does not exist');
  }
  if (!company) {
    throw new Error('Company does not exist');
  }
  const contracts = await prisma.contracts.findMany({
    where: {
      companyID: companyID,
      userID: userID,
    },
  });

  const mappedContracts = contracts.map((contract) => {
    return {
      id: contract.id,
      contractType: contract.contractType,
      startDate: contract.startDate,
      endDate: contract.endDate,
    };
  });

  try {
    const payload = { companyID: companyID, userID: userID };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, contracts: mappedContracts };
  } catch (error) {
    throw new Error(`Error generating response ${error}`);
  }
}
