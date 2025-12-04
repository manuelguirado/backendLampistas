import { PrismaClient } from '../../../generated/prisma';
import { MachineryType } from '../../utils/types/machineType';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function createMachinery(machineType: MachineryType) {
  console.log('Received machinery data:', machineType);
  if (
    !machineType.name ||
    !machineType.description ||
    !machineType.companyID ||
    !machineType.model ||
    !machineType.brand ||
    !machineType.serialNumber
  ) {
    throw new Error('All fields are required');
  }
  const company = await prisma.company.findUnique({
    where: { companyID: machineType.companyID },
  });
  if (!company) {
    throw new Error('Company does not exist');
  }
  console.log('Creating machinery for companyID:', machineType.companyID);
  const machinery = await prisma.machinery.create({
    data: {
      name: machineType.name,
      description: machineType.description,
      brand: machineType.brand,
      companyID: machineType.companyID,
      clientID: machineType.clientID ?? 0, // Provide a valid clientID or handle appropriately
      model: machineType.model,
      serialNumber: machineType.serialNumber,
      maintenanceDate: machineType.maintenanceDate ?? new Date(),
      lastInspectionDate: machineType.lastInspectionDate ?? new Date(),
      installedAt: machineType.installedAT ?? new Date(),
      machineType: machineType.machineType ?? 'UNKNOWN',
      companyName: machineType.companyName ?? 'UNKNOWN',
    },
  });
  try {
    const payload = { companyID: company.companyID, role: 'COMPANY' };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...machinery };
  } catch (error) {
    throw new Error('Error generating token', error);
  }
}
