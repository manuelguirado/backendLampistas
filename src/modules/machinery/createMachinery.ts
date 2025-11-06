import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function createMachinery(
  name: string,
  description: string,
  maintanceDate: Date,
  lastInspectionDate: Date,
  InstalledAT: Date,
  clientId: number,
  companyName: string,
  machineType: string,
  companyID: number,
  serialNumber: string,
) {
  if (
    !name ||
    !description ||
    !maintanceDate ||
    !lastInspectionDate ||
    !InstalledAT ||
    !clientId ||
    !companyName ||
    !machineType ||
    !companyID ||
    !serialNumber
  ) {
    throw new Error('All fields are required');
  }
  const machinery = await prisma.machinery.create({
    data: {
      name,
      description,
      maintenanceDate: maintanceDate,
      lastInspectionDate: lastInspectionDate,
      installedAt: InstalledAT,
      clientID: clientId,
      companyName,
      machineType,
      companyID,
      serialNumber,
    },
  });
  try {
    const payload = { companyID: companyID, role: 'COMPANY' };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...machinery };
  } catch (error) {
    throw new Error('Error generating token', error);
  }
}
