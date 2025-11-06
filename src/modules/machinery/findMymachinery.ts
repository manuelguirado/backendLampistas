import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function findMyMachinery(companyID: number) {
  if (!companyID) {
    throw new Error('Company ID is required');
  }
  const machineryList = await prisma.machinery.findMany({
    where: { companyID: companyID },
  });
  try {
    const payload = { companyID, role: 'COMPANY' };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    const mapMachinery = machineryList.map(
      (machinery: {
        id: number;
        name: string;
        machineType: string;
        serialNumber: string;
        companyID: number;
      }) => ({
        machineryID: machinery.id,
        name: machinery.name,
        type: machinery.machineType,
        serialNumber: machinery.serialNumber,
        companyID: machinery.companyID,
      }),
    );
    return { machinery: mapMachinery, token };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
