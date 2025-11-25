import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
import type { ContractType } from '../../utils/types/contractType';
import jwt, { SignOptions } from 'jsonwebtoken';
export async function createContract(
  companyID: number,
  contractType: ContractType,
  userID: number,
) {
  if (!companyID || !contractType) {
    throw new Error('companyID and contractType are required');
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
  if (contractType !== 'contract' && contractType !== 'freeChoice') {
    throw new Error('Invalid contractType value');
  }
  if (!company) {
    throw new Error('Company does not exist');
  }
  const contract = await prisma.contracts.create({
    data: { companyID: companyID, userID: userID, contractType: contractType },
  });
  if (!contract) {
    throw new Error('Contract does not exist for this company');
  }

  const updatedCompany = await prisma.contracts.update({
    where: { id: contract.id },
    data: { contractType: contractType },
  });
  try {
    const payload = { companyID: company.companyID, role: company.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { ...updatedCompany, token };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
