import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function listClients(
  companyID: number,
  limit: number,
  offset: number,
) {
  if (!companyID) {
    throw new Error('companyID is required');
  }

  // Primero obtén los contratos de esta compañía
  const contracts = await prisma.contracts.findMany({
    where: { companyID },
    include: {
      user: true, // Incluye la información del usuario
    },
    take: limit,
    skip: offset,
  });

  const total = await prisma.contracts.count({
    where: { companyID },
  });

  const mappedClients = contracts.map((contract) => {
    return {
      userID: contract.user.userID,
      name: contract.user.name,
      email: contract.user.email,
      contract: contract.contractType, // ✅ Esto debería ser correcto ahora
    };
  });

  try {
    const payload = { companyID: companyID, role: 'COMPANY' };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, clients: mappedClients, total };
  } catch (error) {
    throw new Error(`Error generating token: ${error}`);
  }
}
