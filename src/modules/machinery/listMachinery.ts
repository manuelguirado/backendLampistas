import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
const prisma = new PrismaClient();
export async function listMachinery(
  companyID: number,
  limit: number = 10,
  offset: number = 0,
) {
  const machineryList = await prisma.machinery.findMany({
    where: {
      companyID: companyID,
    },
    skip: offset,
    take: limit,
  });
  const totalCount = await prisma.machinery.count({
    where: {
      companyID: companyID,
    },
  });
  const mappedMachinery = machineryList.map((machinery) => {
    return {
      machineryID: machinery.id,
      name: machinery.name,
      model: machinery.model,
      serialNumber: machinery.serialNumber,
      machineType: machinery.machineType,
      brand: machinery.brand,
      installedAt: machinery.installedAt,
      description: machinery.description,
      companyName: machinery.companyName,
      clientID: machinery.clientID,
    };
  });

  try {
    const payload = { companyID: companyID, role: 'COMPANY' };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, machinery: mappedMachinery, total: totalCount };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
