import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function findMyMachinery(userID: number) {
  if (!userID) {
    throw new Error('User ID is required');
  }
  const machineryList = await prisma.machinery.findMany({
    where: { clientID: userID },
  });
  try {
    const payload = { userID, role: 'USER' };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    const mapMachinery = machineryList.map(
      (machinery: {
        id: number;
        name: string;
        model?: string | null;
        description: string;
        brand: string;
        installedAt: Date | null;
        lastInspectionDate: Date | null;
        machineType: string;
        serialNumber: string;
        companyID: number;
        clientID: number;
      }) => ({
        machineryID: machinery.id,
        name: machinery.name,
        type: machinery.machineType,
        serialNumber: machinery.serialNumber,
        companyID: machinery.companyID,
        model: machinery.model ?? '',
        brand: machinery.brand,
        description: machinery.description,
        installedAt: machinery.installedAt ?? null,
        lastInspectionDate: machinery.lastInspectionDate ?? null,

        clientID: machinery.clientID,
      }),
    );

    return { machinery: mapMachinery, token };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
