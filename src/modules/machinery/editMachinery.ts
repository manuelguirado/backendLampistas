import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function editMachinery(
  machineryID: number,
  companyID: number,
  updates: {
    description?: string;
    machineType?: string;
    brand?: string;
    model?: string;
    serialNumber?: string;
    lastInspectionDate?: Date;
    maintenanceDate?: Date;
    installedAT?: Date;
  },
) {
  if (!machineryID || !companyID) {
    throw new Error('machineryID and companyID are required');
  }
  const machienry = await prisma.machinery.findFirst({
    where: { id: machineryID, companyID },
  });
  if (!machienry) {
    throw new Error('Machinery does not exist');
  }

  const updatedMachinery = await prisma.machinery.update({
    where: { id: machineryID },
    data: {
      ...updates,
    },
  });
  try {
    const payload = {
      machineryID: updatedMachinery.id,
      companyID: updatedMachinery.companyID,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, machinery: updatedMachinery };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
