import { PrismaClient } from '../../../generated/prisma';
import { MachineryType } from '../../utils/types/machineType';
import jwt, { SignOptions } from 'jsonwebtoken';
import { sendMachineryEmail } from '../mailing/sendMachineryEmail';
const prisma = new PrismaClient();

export async function createMachinery(
  machineryType: MachineryType,
  userID: number,
) {
  // Validar solo campos básicos requeridos+

  if (
    !machineryType.name ||
    !machineryType.companyID ||
    !machineryType.model ||
    !machineryType.serialNumber ||
    !machineryType.machineType
  ) {
    throw new Error(
      'Name, companyID, model, serialNumber and machineType are required',
    );
  }

  const clientID = await prisma.user.findFirst({
    where: { userID: userID },
  });
  if (!clientID) {
    throw new Error('Client does not exist');
  }
  // Verificar que la empresa exista
  const company = await prisma.company.findUnique({
    where: { companyID: machineryType.companyID },
  });

  if (!company) {
    throw new Error('Company does not exist');
  }

  // Crear maquinaria
  const machinery = await prisma.machinery.create({
    data: {
      name: machineryType.name,
      companyID: machineryType.companyID,
      model: machineryType.model,
      serialNumber: machineryType.serialNumber,
      machineType: machineryType.machineType,
      description: machineryType.description || '',
      brand: machineryType.brand || 'UNKNOWN',
      installedAt: machineryType.installedAT || new Date(),
      companyName: machineryType.companyName || 'UNKNOWN',
      clientID: machineryType.clientID || 0, // ✅ null si no hay cliente
    },
  });
  const machineryEmail = await sendMachineryEmail(
    `Nueva Maquinaria: ${machinery.name}`,
    `Se ha creado una nueva maquinaria con el siguiente detalle:
    - Nombre: ${machinery.name}
    - Modelo: ${machinery.model}
    - Número de Serie: ${machinery.serialNumber}
    - Tipo: ${machinery.machineType}
    - Empresa: ${company.name}
    `,
  );
  try {
    const payload = { companyID: company.companyID, role: 'COMPANY' };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...machinery, machineryEmail };
  } catch (error) {
    throw new Error('Error generating token', error);
  }
}
