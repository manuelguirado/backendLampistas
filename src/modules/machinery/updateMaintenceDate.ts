import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function updateMaintenceDate(
  machineryID: number,
  maintenceDate: Date,
) {
  if (!machineryID || !maintenceDate) {
    throw new Error('machineryID and maintenceDate are required');
  }
  const machinery = await prisma.machinery.findUnique({
    where: { id: machineryID },
  });
  if (!machinery) {
    throw new Error('Machinery does not exist');
  }

  const updatedMachinery = await prisma.machinery.update({
    where: { id: machineryID },
    data: { lastInspectionDate: maintenceDate },
  });
  try {
    const payload = {
      machineryID: updatedMachinery.id,
      companyID: updatedMachinery.companyID,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { updatedMachinery, token };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
