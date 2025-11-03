import { PrismaClient } from '../../../generated/prisma';
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
    !companyID
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
    },
  });
  return machinery;
}
