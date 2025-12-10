import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();
export async function eliminateMachinery(machineryID: number) {
  if (!machineryID) {
    throw new Error('machineryID is required');
  }
  const machinery = await prisma.machinery.findUnique({
    where: { id: machineryID },
  });
  if (!machinery) {
    throw new Error('Machinery does not exist');
  }

  const deletedMachinery = await prisma.machinery.delete({
    where: { id: machineryID },
  });

  if (!deletedMachinery) {
    throw new Error('Failed  eliminate machinery');
  }
  try {
    const payload = {
      machineryID: machineryID,
      companyID: machinery.companyID,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { message: 'Machinery eliminated successfully', token };
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
