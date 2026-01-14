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

  // Filtrar campos vacíos o undefined
  const filteredUpdates: Record<string, any> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined && value !== null && value !== '') {
      filteredUpdates[key] = value;
    }
  }

  if (
    filteredUpdates.serialNumber &&
    filteredUpdates.serialNumber === machienry.serialNumber
  ) {
    delete filteredUpdates.serialNumber;
  }

  // Si el serialNumber cambió, verificar que no exista en otra maquinaria
  if (filteredUpdates.serialNumber) {
    const existingMachinery = await prisma.machinery.findFirst({
      where: {
        serialNumber: filteredUpdates.serialNumber,
        id: { not: machineryID },
      },
    });
    if (existingMachinery) {
      throw new Error('El número de serie ya existe en otra maquinaria');
    }
  }

  const updatedMachinery = await prisma.machinery.update({
    where: { id: machineryID },
    data: filteredUpdates,
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
